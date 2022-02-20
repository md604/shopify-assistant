import React, { useState, useContext, useCallback } from 'react';
import { Card, 
    Icon, 
    Badge,
    Stack, 
    Heading, 
    Subheading, 
    Popover,
    ActionList,
    Button,
    ButtonGroup,
    TextContainer,
    Caption,
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
import { PopupContext } from './PopupContext';
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

type ThemesCardProps = {
    theme:ShopifyTheme;
};

export function ThemesCard({ theme }:ThemesCardProps) {
    const [badgeData, setBadgeData] = useState<BadgeProps>(getBadgeProps(theme));
    const [lastUpdateMessage, setLastUpdateMessage] = useState<string>(getLastUpdateMsg(theme.lastUpdate));
    const handleViewBtnClick = useCallback(() => {
        console.log('View btn click: ');
    }, []);
    return (
        <Card key={`${theme.id}`}>
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
                <Stack distribution="equalSpacing">
                    <Stack>
                        <Icon source={LinkMinor} />
                        <Subheading>Links</Subheading>
                    </Stack>
                    <Button plain monochrome>Edit</Button>
                </Stack>
                }
            >
                <Stack spacing="loose">
                    <ButtonGroup segmented>
                        <Button
                        onClick={handleViewBtnClick}
                        >View</Button>
                        <Button icon={
                            <Icon source={ClipboardMinor} />
                        }></Button>
                        <Button icon={
                            <Icon source={ShopcodesMajor} />
                        }></Button>
                    </ButtonGroup>
                    <ButtonGroup segmented>
                        <Button>Configure</Button>
                        <Button icon={
                            <Icon source={ClipboardMinor} />
                        }></Button>
                        <Button icon={
                            <Icon source={ShopcodesMajor} />
                        }></Button>
                    </ButtonGroup>
                </Stack>
            </Card.Section>
            { false && <Card.Section
                title={
                <Stack>
                    <Icon source={ProductsMajor} />
                    <Subheading>Tags</Subheading>
                </Stack>
                }
            >
                There are no tags
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
                <Button plain monochrome fullWidth>Show more options</Button>
            </div>
        </Card>
    );
}