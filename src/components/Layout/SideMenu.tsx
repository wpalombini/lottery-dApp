import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

export interface ISideMenuProps {
  isSideMenuOpen: boolean;
  toggleSideMenu: () => void;
  listItems: IListItem[];
}

export interface IListItem {
  title: string;
  url: string;
  icon: JSX.Element;
}

const DivListStyled = styled('div')(
  // eslint-disable-next-line
  ({ theme }) =>
    `
  width: 250px
`,
);
const DivHeaderStyled = styled('div')(
  // eslint-disable-next-line
  ({ theme }) =>
    `
  padding-left: 24px
`,
);

const SideMenu: (props: ISideMenuProps) => JSX.Element = (props: ISideMenuProps): JSX.Element => {
  const toggleSideMenu: () => (event: React.KeyboardEvent | React.MouseEvent) => void =
    () => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      props.toggleSideMenu();
    };

  return (
    <Drawer anchor="left" open={props.isSideMenuOpen} onClose={toggleSideMenu()}>
      <DivHeaderStyled>
        <h3>Lottery dApp</h3>
      </DivHeaderStyled>

      <Divider />
      <DivListStyled role="presentation" onClick={toggleSideMenu()} onKeyDown={toggleSideMenu()}>
        <List>
          {props.listItems.map(
            (listItem: IListItem, index: number): JSX.Element => (
              <Link style={{ color: 'rgba(0, 0, 0, 0.87)' }} to={listItem.url} key={index}>
                <ListItem button>
                  <ListItemIcon>{listItem.icon}</ListItemIcon>
                  <ListItemText primary={listItem.title} />
                </ListItem>
              </Link>
            ),
          )}
        </List>
      </DivListStyled>
    </Drawer>
  );
};

export default SideMenu;
