import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  a: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
  header: {
    paddingLeft: 24,
  },
});

const SideMenu: (props: ISideMenuProps) => JSX.Element = (props: ISideMenuProps): JSX.Element => {
  const classes = useStyles();

  const toggleSideMenu: () => (event: React.KeyboardEvent | React.MouseEvent) => void = () => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
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
      <div className={classes.header}>
        <h3>Lottery dApp</h3>
      </div>

      <Divider />
      <div className={classes.list} role="presentation" onClick={toggleSideMenu()} onKeyDown={toggleSideMenu()}>
        <List>
          {props.listItems.map(
            (listItem: IListItem, index: number): JSX.Element => (
              <Link className={classes.a} to={listItem.url} key={index}>
                <ListItem button>
                  <ListItemIcon>{listItem.icon}</ListItemIcon>
                  <ListItemText primary={listItem.title} />
                </ListItem>
              </Link>
            ),
          )}
        </List>
      </div>
    </Drawer>
  );
};

export default SideMenu;
