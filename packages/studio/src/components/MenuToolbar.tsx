import React, {useCallback, useContext, useMemo} from 'react';
import {ConfigInternals} from 'remotion';
import {BACKGROUND} from '../helpers/colors';
import {areKeyboardShortcutsDisabled} from '../helpers/use-keybinding';
import {ModalsContext} from '../state/modals';
import {SidebarContext} from '../state/sidebar';
import {askAiModalRef} from './AskAiModal';
import {inlineCodeSnippet} from './Menu/styles';
import {NewComposition} from './NewComposition/NewComposition';
import {showNotification} from './Notifications/NotificationCenter';
import {
	openQuickSwitcherQuickSwitcher,
	QuickSwitcher,
} from './QuickSwitcher/QuickSwitcher';
import {RenderModal} from './RenderModal/RenderModal';
import {RenderQueue} from './RenderQueue/RenderQueue';
import {SplitterContainer} from './Splitter/SplitterContainer';
import {SplitterElement} from './Splitter/SplitterElement';
import {SplitterHandle} from './Splitter/SplitterHandle';
import {UpdateCheck} from './UpdateCheck';

const container: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	color: 'white',
	borderBottom: '1px solid black',
	fontSize: 13,
	paddingLeft: 6,
	paddingRight: 10,
	backgroundColor: BACKGROUND,
	borderRight: '1px solid black',
};

const flex: React.CSSProperties = {
	flex: 1,
};

const fixedWidthRight: React.CSSProperties = {
	width: 300,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-end',
	paddingRight: 6,
};

const row: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
};

export const MenuToolbar: React.FC = () => {
	const {sidebarCollapsedStateLeft} = useContext(SidebarContext);
	const {selectedModal, setSelectedModal} = useContext(ModalsContext);

	const itemClicked = useCallback(() => {
		showNotification(
			`To make a new composition, right-click an existing one and select "Duplicate"`,
			5000,
		);
	}, []);

	const onQuickSwitcherClicked = useCallback(() => {
		openQuickSwitcherQuickSwitcher({setSelectedModal});
	}, [setSelectedModal]);

	const onAskAiClicked = useCallback(() => {
		askAiModalRef.current?.toggle();
	}, []);

	const keyboardShortcutsDisabled = areKeyboardShortcutsDisabled();

	const askAiFeatureEnabled = useMemo(
		() => ConfigInternals.getAskAiFeatureEnabled(),
		[],
	);

	return (
		<SplitterContainer
			orientation="horizontal"
			id="sidebar-to-main"
			defaultFlex={0.15}
			maxFlex={0.3}
			minFlex={0.15}
		>
			<SplitterElement type="flexer" sticky={null}>
				<div style={container}>
					<div style={flex}>
						<div style={row}>
							<NewComposition itemClicked={itemClicked} />
							<div style={{width: 10}} />
							<button
								type="button"
								onClick={onQuickSwitcherClicked}
								style={inlineCodeSnippet}
								title={
									keyboardShortcutsDisabled
										? 'Quick switcher'
										: 'Quick switcher (Cmd+K)'
								}
							>
								{keyboardShortcutsDisabled ? '🔍' : '⌘K'}
							</button>
							{askAiFeatureEnabled ? (
								<>
									<div style={{width: 10}} />
									<button
										type="button"
										onClick={onAskAiClicked}
										style={inlineCodeSnippet}
										title={
											keyboardShortcutsDisabled
												? 'Ask AI'
												: 'Ask AI (Cmd+I)'
										}
									>
										{keyboardShortcutsDisabled ? '🤖' : '⌘I'}
									</button>
								</>
							) : null}
						</div>
					</div>
					<div style={fixedWidthRight}>
						<UpdateCheck />
					</div>
				</div>
			</SplitterElement>
			<SplitterHandle
				allowToCollapse="left"
				onCollapse={() => null}
				onUncollapse={() => null}
				collapsed={sidebarCollapsedStateLeft === 'collapsed'}
			/>
			<SplitterElement type="anti-flexer" sticky={null}>
				<RenderQueue />
			</SplitterElement>
			{selectedModal.type === 'render' ? <RenderModal /> : null}
			{selectedModal.type === 'quick-switcher' ? <QuickSwitcher /> : null}
		</SplitterContainer>
	);
};
