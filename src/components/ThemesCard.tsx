import React, { useState, useContext, useCallback } from 'react';
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

type ThemesCardProps = {
    theme:ShopifyTheme;
};

export function ThemesCard({ theme }:ThemesCardProps) {
    const [badgeData, setBadgeData] = useState<BadgeProps>(getBadgeProps(theme));
    const [tagPopoverActive, setTagPopoverActive] = useState<boolean>(false);
    const [themeTags, setThemeTags] = useState<string[]>(['one', 'two']);
    const [newTagValue, setNewTagValue] = useState<string>('');
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
    const [lastUpdateMessage, setLastUpdateMessage] = useState<string>(getLastUpdateMsg(theme.lastUpdate));
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
    const handleViewQRcodeBtnClick = useCallback(() => {
        console.log('Show QR code for the view url: ', viewUrl);
    }, []);
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
    const handleSetupQRcodeBtnClick = useCallback(() => {
        console.log('Show QR code for the setup url: ', setupUrl);
    }, []);
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
                    <div style={{ minWidth: '56px', textAlign: 'right' }}>
                        <Button icon={
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
                        <Button
                        onClick={handleViewBtnClick}
                        >View</Button>
                        <Button 
                        onClick={handleViewClipboardBtnClick}
                        icon={
                            <Icon source={ClipboardMinor} />
                        }></Button>
                        <Button 
                        onClick={handleViewQRcodeBtnClick}
                        icon={
                            <Icon source={ShopcodesMajor} />
                        }></Button>
                    </ButtonGroup>
                    <ButtonGroup segmented>
                        <Button
                        onClick={handleSetupBtnClick}
                        >Setup</Button>
                        <Button 
                        onClick={handleSetupClipboardBtnClick}
                        icon={
                            <Icon source={ClipboardMinor} />
                        }></Button>
                        <Button 
                        onClick={handleSetupQRcodeBtnClick}
                        icon={
                            <Icon source={ShopcodesMajor} />
                        }></Button>
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
                                label="Create new tag"
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
                plain monochrome fullWidth>Show more options</Button>
            </div>
        </Card>
    );
}