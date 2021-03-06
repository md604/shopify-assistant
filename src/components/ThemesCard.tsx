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
    PinMajor,
    DeleteMajor,
    ClipboardMinor,
    ShopcodesMajor } from '@shopify/polaris-icons';
import { PopupContext } from './PopupContext';
import { ShopifyTheme, ThemeMeta } from '../utils/interfaces';
import QRCode from 'qrcode';

function getLastUpdateMsg(t:number):string {
    let msg = '';
    const presentTime:number = Date.now(),
        timeSinceLastUpdate:number = presentTime - t, 
        ONE_DAY:number = 60 * 60 * 24,
        THREE_DAYS:number = ONE_DAY * 3;
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
    } else if (!theme.available) {
        status = 'critical';
        children = 'Gone';
    }
    return {
        progress: theme.published || !theme.available ? 'complete' : 'incomplete',
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

function storeUpdateThemeMeta(theme:ShopifyTheme, metaProps: Partial<ThemeMeta>) {
    const updatedTheme: ShopifyTheme = { ...theme, ...metaProps };
    // save to store
    chrome.runtime.sendMessage({
        type: 'updateThemeMeta',
        data: {
            theme: updatedTheme
        },
        to: 'sw'
    });
}

type ThemesCardProps = {
    theme:ShopifyTheme;
};

export function ThemesCard({ theme }:ThemesCardProps) {
    const { updateTheme, deleteTheme } = useContext(PopupContext);
    const [badgeData, setBadgeData] = useState<BadgeProps>(getBadgeProps(theme));
    const [tagPopoverActive, setTagPopoverActive] = useState<boolean>(false);
    const viewQRCodeContainer = useRef<HTMLDivElement>(null);
    const [viewQRCodePopoverActive, setViewQRCodePopoverActive] = useState<boolean>(false);
    const setupQRCodeContainer = useRef<HTMLDivElement>(null);
    const [setupQRCodePopoverActive, setSetupQRCodePopoverActive] = useState<boolean>(false);
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
    const [lastUpdateMessage, setLastUpdateMessage] = useState<string>(getLastUpdateMsg(theme.lastUpdate));
    // theme meta data
    const [pinned, setPinned] = useState<boolean>(theme.pinned);
    const [themeTags, setThemeTags] = useState<string[]>(theme.tags);
    const [newTagValue, setNewTagValue] = useState<string>('');
    // pin btn
    const togglePinBtnClick = useCallback(() => {
        // save localy
        setPinned(!pinned);
    }, []);
    // delete btn
    const deleteBtnClick = () => {
        // save localy
        deleteTheme(theme);
    };
    // view btn
    const [viewUrl, setViewUrl] = useState<string>(getViewUrl(theme)); 
    const handleViewBtnClick = useCallback(() => {
        chrome.tabs.create(
            {
                active: false,
                url: viewUrl
            }
        );
    }, []);
    const handleViewClipboardBtnClick = useCallback(() => {
        setClipboard(viewUrl);
    }, []);
    const toggleViewQRCodePopoverActive = useCallback(() => {
        setViewQRCodePopoverActive(!viewQRCodePopoverActive);
    }, [viewQRCodePopoverActive]);
    // setup or configurer btn
    const [setupUrl, setSetupUrl] = useState<string>(getSetupUrl(theme));
    const handleSetupBtnClick = useCallback(() => {
        chrome.tabs.create(
            {
                active: false,
                url: setupUrl
            }
        );
    }, []);
    const handleSetupClipboardBtnClick = useCallback(() => {
        setClipboard(setupUrl);
    }, []);
    const toggleSetupQRCodePopoverActive = useCallback(() => {
        setSetupQRCodePopoverActive(!setupQRCodePopoverActive);
    }, [setupQRCodePopoverActive]);
    // tags
    const removeTag = useCallback((removeTagValue) => () => {
        const updatedTags: string[] = themeTags.filter(currentTagValue => currentTagValue != removeTagValue);
        setThemeTags(updatedTags);
    }, [themeTags]);
    const handleNewTagValueChange = useCallback((newValue) => {
        setNewTagValue(newValue);
    }, []);
    const handleNewTagSubmit = useCallback(() => {
        if (newTagValue.length > 1) {
            const updatedTags: string[] = [newTagValue, ...themeTags];
            setThemeTags(updatedTags);
        } 
        setNewTagValue('');
        toggleTagPopoverActive();
    }, [newTagValue]);
    const toggleTagPopoverActive = useCallback(() => {
        setTagPopoverActive(!tagPopoverActive);
    }, [tagPopoverActive]);
    // show more
    const handleShowMoreBtnClick = useCallback(() => {
        setShowMoreOptions(!showMoreOptions);
    }, [showMoreOptions]);

    useEffect(()=>{
        if (setupQRCodePopoverActive && setupQRCodeContainer.current) {
            createQRCode(setupUrl, setupQRCodeContainer.current);
        }
        if (viewQRCodePopoverActive && viewQRCodeContainer.current) {
            createQRCode(viewUrl, viewQRCodeContainer.current);
        }
    },[setupQRCodePopoverActive, viewQRCodePopoverActive]);

    useEffect(()=>{
        const themeMeta: Partial<ThemeMeta> = { pinned, tags: themeTags };
        // update context themes
        updateTheme({ ...theme, ...themeMeta });
        // save to store
        storeUpdateThemeMeta(theme, themeMeta);
    },[themeTags, pinned]);

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
                    <div style={{ minWidth: '56px', textAlign: 'right' }} className={pinned && theme.available ? 'pin-btn--active' : ''}>
                        <Button 
                        onClick={theme.available ? togglePinBtnClick : deleteBtnClick}
                        icon={
                            <Icon source={theme.available ? PinMajor : DeleteMajor} />
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