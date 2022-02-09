import React, { useState, useContext } from 'react';
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
    TextStyle } from '@shopify/polaris';
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
/*
interface ThemesListProps {
    themes: ShopifyTheme[];
}
{ themes }:ThemesListProps
*/
/*
 <ButtonGroup>
    <Popover
    active={false}
    activator={
        <Button disclosure icon={SettingsMajor}>
            
        </Button>
    }
    onClose={() => {}}
    >
        <ActionList 
        actionRole="menuitem"
        items={[{content: 'Tags'}, {content: 'Notes'}]} />
    </Popover>
    <Button icon={
        <Icon source={PinMajor} />
    }></Button>
</ButtonGroup>
*/
export function ThemesList() {
    const [visibleThemes, setVisibleThemes] = useState([]);
    const { themes } = useContext(PopupContext);
    return (
        <div style={{margin: '16px auto 0'}}>
            {
                themes.length > 0 ?
                themes.map((theme,i) => (
                    <Card key={`${theme.id}-${i}`}>
                        <Card.Section>
                            <div style={{ width:'100%', display: 'flex' }}>
                                <div style={{ maxWidth:'calc(100% - 56px)', width: '100%' }}>
                                    <Stack vertical={true}>
                                        <Stack>
                                            <Badge
                                                status="success"
                                                progress="complete"
                                                statusAndProgressLabelOverride="Status: Published. Your online store is visible."
                                                >
                                                Live
                                            </Badge>
                                            <TextStyle variation="subdued">Updated 3 days ago</TextStyle>
                                        </Stack>
                                        <Heading>{theme.name}</Heading>
                                    </Stack>
                                    <TextContainer spacing="tight">
                                        <p><TextStyle variation="subdued">vue-js-example.myshopify.com</TextStyle></p>
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
                                    <Button>View</Button>
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
                )) :
                <div>There are no local themes</div>
            }
        </div>
    );
}