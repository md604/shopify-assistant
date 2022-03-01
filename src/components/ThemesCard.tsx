import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { Card, 
    Icon, 
    Badge,
    Stack, 
    Heading, 
    Subheading, 
    Popover,
    Tag,
    Button,
    ButtonGroup,
    TextContainer,
    Form,
    TextField,
    TextStyle,
    Tooltip, 
    BadgeProps} from '@shopify/polaris';
import { LinkMinor, 
    ProductsMajor,
    NoteMajor,
    SettingsMajor,
    PinMajor,
    CircleTickMinor,
    ClipboardMinor,
    ShopcodesMajor } from '@shopify/polaris-icons';
//import { PopupContext } from './PopupContext';
import { ShopifyTheme } from '../utils/interfaces';
//import { ShopifyTheme } from '../utils/interfaces';
import QRCode from 'qrcode';

function getLastUpdateMsg(t:number):string {
    let msg = '';
    const presentTime:number = Date.now(),
        timeSinceLastUpdate:number = presentTime - t, 
        ONE_DAY:number = 60 * 60 * 24,
        TWO_DAYS:number = ONE_DAY * 2,
        THREE_DAYS:number = ONE_DAY * 3,
        options = {

        };
    if (timeSinceLastUpdate > THREE_DAYS) {
        msg = `Updated ${new Intl.DateTimeFormat(
            'default', 
            {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            }
        ).format(t)}`;
    } else if (timeSinceLastUpdate > ONE_DAY && timeSinceLastUpdate <= THREE_DAYS) {
        msg = `Updated ${Math.round(timeSinceLastUpdate / ONE_DAY)} days ago`;
    } else {
        msg = `Updated at ${new Intl.DateTimeFormat(
            'default', 
            {
                timeStyle: "short"
            }
        ).format(t)}`;
    }
    return msg;
}

function getBadgeProps(theme:ShopifyTheme):BadgeProps {
    let status:BadgeProps['status'] = 'new',
        children:BadgeProps['children'] = 'Live';

    if (theme.published) {
        status = 'success';
    } else if (theme.developer) {
        status = 'attention';
        children = 'Dev';
    }
    return {
        progress: theme.published ? 'complete' : 'incomplete',
        status, 
        children
    };
}

function getViewUrl(theme:ShopifyTheme):string {
    return `https://${theme.domainName}?preview_theme_id=${theme.id}`;
}

function getSetupUrl(theme:ShopifyTheme):string {
    return `https://${theme.domainName}/admin/themes/${theme.id}/editor`;
}

function setClipboard(text:string):void {
    var type = "text/plain";
    var blob = new Blob([text], { type });
    var data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
        function () {
        /* success */
        },
        function () {
        /* failure */
        }
    );
}

function createQRCode(url:string,svgContainer:HTMLDivElement) {
    try {
        QRCode.toString( url, { type: 'svg' }, function (err, svg) {
            if (err) throw err;
            if (svgContainer) svgContainer.innerHTML = svg;
        });
    } catch (err) {
        console.log('Problems with QR code: ', err);
    }
}

type ThemesCardProps = {
    theme:ShopifyTheme;
};

export function ThemesCard({ theme }:ThemesCardProps) {
    const [badgeData, setBadgeData] = useState<BadgeProps>(getBadgeProps(theme));
    const [tagPopoverActive, setTagPopoverActive] = useState<boolean>(false);
    const viewQRCodeContainer = useRef<HTMLDivElement>(null);
    const [viewQRCodePopoverActive, setViewQRCodePopoverActive] = useState<boolean>(false);
    const setupQRCodeContainer = useRef<HTMLDivElement>(null);
    const [setupQRCodePopoverActive, setSetupQRCodePopoverActive] = useState<boolean>(false);
    const [pinned, setPinned] = useState<boolean>(theme.pinned);
    const [themeTags, setThemeTags] = useState<string[]>(['one', 'two']);
    const [newTagValue, setNewTagValue] = useState<string>('');
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
    const [lastUpdateMessage, setLastUpdateMessage] = useState<string>(getLastUpdateMsg(theme.lastUpdate));
    // pin btn
    const togglePinBtnClick = useCallback(() => {
        setPinned(!pinned);
        console.log('Pin status: ', pinned);
    }, [pinned]);
    // view btn
    const [viewUrl, setViewUrl] = useState<string>(getViewUrl(theme)); 
    const handleViewBtnClick = useCallback(() => {
        console.log('Open view url in a new window: ', viewUrl);
        chrome.tabs.create(
            {
                active: false,
                url: viewUrl
            }
        );
    }, []);
    const handleViewClipboardBtnClick = useCallback(() => {
        setClipboard(viewUrl);
        console.log('Copy view url to the clipboard: ', viewUrl);
    }, []);
    const toggleViewQRCodePopoverActive = useCallback(() => {
        setViewQRCodePopoverActive(!viewQRCodePopoverActive);
    }, [viewQRCodePopoverActive]);
    // setup or configurer btn
    const [setupUrl, setSetupUrl] = useState<string>(getSetupUrl(theme));
    const handleSetupBtnClick = useCallback(() => {
        console.log('Open setup url in a new window: ', setupUrl);
        chrome.tabs.create(
            {
                active: false,
                url: setupUrl
            }
        );
    }, []);
    const handleSetupClipboardBtnClick = useCallback(() => {
        setClipboard(setupUrl);
        console.log('Copy setup url to the clipboard: ', setupUrl);
    }, []);
    const toggleSetupQRCodePopoverActive = useCallback(() => {
        setSetupQRCodePopoverActive(!setupQRCodePopoverActive);
    }, [setupQRCodePopoverActive]);
    // tags
    const removeTag = useCallback((removeTagValue) => () => {
        setThemeTags(themeTags.filter(currentTagValue => currentTagValue != removeTagValue));
    }, [themeTags]);
    const handleNewTagValueChange = useCallback((newValue) => {
        setNewTagValue(newValue);
    }, []);
    const handleNewTagSubmit = useCallback(() => {
        if (newTagValue.length > 1) setThemeTags([newTagValue, ...themeTags]);
        console.log('Tag submitted: ', newTagValue, themeTags);
        setNewTagValue('');
        toggleTagPopoverActive();
    }, [newTagValue]);
    const toggleTagPopoverActive = useCallback(() => {
        setTagPopoverActive(!tagPopoverActive);
    }, [tagPopoverActive]);
    // show more
    const handleShowMoreBtnClick = useCallback(() => {
        setShowMoreOptions(!showMoreOptions);
        console.log('Show all options', showMoreOptions);
    }, [showMoreOptions]);

    useEffect(()=>{
        if (setupQRCodePopoverActive && setupQRCodeContainer.current) {
            createQRCode(setupUrl, setupQRCodeContainer.current);
        }
        if (viewQRCodePopoverActive && viewQRCodeContainer.current) {
            createQRCode(viewUrl, viewQRCodeContainer.current);
        }
    },[setupQRCodePopoverActive, viewQRCodePopoverActive]);

    return (
        <Card>
            <Card.Section>
                <div style={{ width:'100%', display: 'flex' }}>
                    <div style={{ maxWidth:'calc(100% - 56px)', width: '100%' }}>
                        <Stack vertical={true}>
                            <Stack>
                                <Badge
                                    status={badgeData.status}
                                    progress={badgeData.progress}
                                >
                                    {badgeData.children}
                                </Badge>
                                <TextStyle variation="subdued">{lastUpdateMessage}</TextStyle>
                            </Stack>
                            <Heading>{theme.name}</Heading>
                        </Stack>
                        <TextContainer spacing="tight">
                            <p><TextStyle variation="subdued">{theme.domainName}</TextStyle></p>
                        </TextContainer>
                    </div>
                    <div style={{ minWidth: '56px', textAlign: 'right' }} className={pinned ? 'pin-btn--active' : ''}>
                        <Button 
                        onClick={togglePinBtnClick}
                        icon={
                            <Icon source={PinMajor} />
                        }></Button>
                    </div>
                </div>
            </Card.Section>
            <Card.Section
                title={
                <Stack>
                    <Icon source={LinkMinor} />
                    <Subheading>Links</Subheading>
                </Stack>
                }
            >
                <Stack spacing="loose">
                    <ButtonGroup segmented>
                        <Tooltip content="Preview theme in a new tab">
                            <Button
                            onClick={handleViewBtnClick}
                            >View</Button>
                        </Tooltip>
                        <Tooltip content="Copy URL into a clipboard">
                            <Button 
                            onClick={handleViewClipboardBtnClick}
                            icon={
                                <Icon source={ClipboardMinor} />
                            }></Button>
                        </Tooltip>
                        <Popover
                            active={viewQRCodePopoverActive}
                            activator={
                                <Tooltip content="Show QR code">
                                    <Button 
                                    onClick={toggleViewQRCodePopoverActive}
                                    icon={
                                        <Icon source={ShopcodesMajor} />
                                    }></Button>
                                </Tooltip>
                            }
                            onClose={toggleViewQRCodePopoverActive}
                            ariaHaspopup={false}
                            sectioned
                        >
                            <Stack vertical={true}>
                                <div ref={viewQRCodeContainer} 
                                style={{ width:'200px', height:'200px', background: 'green' }}></div>
                                {/* 
                                <Button 
                                onClick={handleShowMoreBtnClick}
                                plain monochrome fullWidth>Copy to clipboard</Button>
                                */} 
                            </Stack> 
                        </Popover>
                    </ButtonGroup>
                    <ButtonGroup segmented>
                        <Tooltip content="Customize theme in a new tab">
                            <Button
                            onClick={handleSetupBtnClick}
                            >Setup</Button>
                        </Tooltip>
                        <Tooltip content="Copy URL into a clipboard">
                            <Button 
                            onClick={handleSetupClipboardBtnClick}
                            icon={
                                <Icon source={ClipboardMinor} />
                            }></Button>
                        </Tooltip>
                        <Popover
                            active={setupQRCodePopoverActive}
                            activator={
                                <Tooltip content="Show QR code">
                                    <Button 
                                    onClick={toggleSetupQRCodePopoverActive}
                                    icon={
                                        <Icon source={ShopcodesMajor} />
                                    }></Button>
                                </Tooltip>
                            }
                            onClose={toggleSetupQRCodePopoverActive}
                            ariaHaspopup={false}
                            sectioned
                        >
                            <Stack vertical={true}>
                                <div ref={setupQRCodeContainer} 
                                style={{ width:'200px', height:'200px', background: 'green' }}></div>
                                {/*
                                <Button 
                                onClick={handleShowMoreBtnClick}
                                plain monochrome fullWidth>Copy to clipboard</Button> 
                                */}
                            </Stack> 
                        </Popover>
                    </ButtonGroup>
                </Stack>
            </Card.Section>
            { showMoreOptions && <Card.Section
                title={
                <Stack distribution="equalSpacing">
                    <Stack>
                        <Icon source={ProductsMajor} />
                        <Subheading>Tags</Subheading>
                    </Stack>
                    <Popover
                        active={tagPopoverActive}
                        activator={
                            <Button
                            onClick={toggleTagPopoverActive} 
                            plain 
                            monochrome>Add</Button>
                        }
                        onClose={toggleTagPopoverActive}
                        ariaHaspopup={false}
                        sectioned
                    >
                        <Form onSubmit={handleNewTagSubmit}>
                            <TextField
                                label="Create a new tag"
                                labelHidden={true}
                                value={newTagValue}
                                onChange={handleNewTagValueChange}
                                placeholder="Ex: GD"
                                autoComplete="off"
                            />
                        </Form>
                    </Popover>
                </Stack>
                }
            >
                <Stack spacing="tight">
                {
                    themeTags.length > 0 ?
                    themeTags.map((option) => (
                        <Tag key={option} onRemove={removeTag(option)}>
                          {option}
                        </Tag>
                    )) : <span>There are no tags</span>
                }
                </Stack>
            </Card.Section>}
            { false && <Card.Section
                title={
                <Stack>
                    <Icon source={NoteMajor} />
                    <Subheading>Notes</Subheading>
                </Stack>
                }
            >
                There are no notes
            </Card.Section>}
            <div style={{ background:'#efefef' }}>
                <Button 
                onClick={handleShowMoreBtnClick}
                plain monochrome fullWidth>{
                    showMoreOptions ? 'Hide options' : 'Show more options'
                }</Button>
            </div>
        </Card>
    );
}