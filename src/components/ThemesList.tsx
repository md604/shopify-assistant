import React, { useState, useContext } from 'react';
import { Card, 
    Icon, 
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
import { LinkMinor, ProductsMajor, NoteMajor, SettingsMajor, PinMajor, CircleTickMinor } from '@shopify/polaris-icons';
import { ShopifyTheme, PopupContext } from './PopupContext';
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
                            <Stack wrap={false} distribution="fill" spacing="loose">
                                <Stack>
                                    <Stack wrap={false}>
                                        <Icon source={CircleTickMinor} color="success" />
                                        <Heading>{theme.name}</Heading>
                                    </Stack>
                                    <TextContainer spacing="tight">
                                        <p><TextStyle variation="subdued">vue-js-example.myshopify.com</TextStyle></p>
                                    </TextContainer>
                                </Stack>
                                <Stack>
                                <Button icon={
                                    <Icon source={PinMajor} />
                                }></Button></Stack>
                            </Stack>
                        </Card.Section>
                        <Card.Section
                            title={
                            <Stack>
                                <Icon source={LinkMinor} />
                                <Subheading>Links</Subheading>
                            </Stack>
                            }
                        >
                            link1, link2
                        </Card.Section>
                        <Card.Section
                            title={
                            <Stack>
                                <Icon source={ProductsMajor} />
                                <Subheading>Tags</Subheading>
                            </Stack>
                            }
                        >
                            There are no tags
                        </Card.Section>
                        <Card.Section
                            title={
                            <Stack>
                                <Icon source={NoteMajor} />
                                <Subheading>Notes</Subheading>
                            </Stack>
                            }
                        >
                            There are no notes
                        </Card.Section>
                    </Card>
                )) :
                <div>There are no local themes</div>
            }
        </div>
    );
}