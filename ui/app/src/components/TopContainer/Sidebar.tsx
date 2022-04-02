/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ExperimentIcon from '@ui/mui-extends/esm/Icons/Experiment'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import { NavLink } from 'react-router-dom'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import clsx from 'clsx'
import i18n from 'components/T'
import logo from 'images/logo.svg'
import logoMini from 'images/logo-mini.svg'
import logoMiniWhite from 'images/logo-mini-white.svg'
import logoWhite from 'images/logo-white.svg'
import { makeStyles } from '@mui/styles'
import { useStoreSelector } from 'store'

export const drawerWidth = '14rem'
export const drawerCloseWidth = '5rem'
const useStyles = makeStyles((theme) => {
  const listItemHover = {
    background: theme.palette.primary.main,
    cursor: 'pointer',
    '& svg': {
      fill: theme.palette.primary.contrastText,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.contrastText,
    },
  }

  return {
    drawer: {
      width: drawerWidth,
    },
    drawerPaperRoot: {
      background: theme.palette.background.default,
      border: 'none',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      width: drawerCloseWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
    },
    toolbar: {
      minHeight: 56,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(6),
    },
    logo: {
      width: '75%',
    },
    logoMini: {
      width: 36,
    },
    list: {
      padding: `${theme.spacing(6)} 0`,
    },
    listItem: {
      width: `calc(100% - ${theme.spacing(6)})`,
      height: 48,
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(3),
      borderRadius: theme.shape.borderRadius,
      '&:last-child': {
        marginBottom: 0,
      },
      '&:hover': listItemHover,
      '&.active': {
        ...listItemHover,
      },
    },
    listItemIcon: {
      paddingRight: theme.spacing(9),
    },
  }
})

const listItems = [
  { icon: <DashboardOutlinedIcon />, text: 'dashboard' },
  {
    icon: <AccountTreeOutlinedIcon />,
    text: 'workflows',
  },
  {
    icon: <ScheduleIcon />,
    text: 'schedules',
  },
  {
    icon: <ExperimentIcon />,
    text: 'experiments',
  },
  {
    icon: <TimelineOutlinedIcon />,
    text: 'events',
  },
  {
    icon: <ArchiveOutlinedIcon />,
    text: 'archives',
  },
  {
    icon: <SettingsOutlinedIcon />,
    text: 'settings',
  },
]

interface SidebarProps {
  open: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const classes = useStyles()

  const { theme } = useStoreSelector((state) => state.settings)

  return (
    <Drawer
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.drawerPaperRoot, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      variant="permanent"
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box>
          <NavLink to="/" className={classes.toolbar}>
            <img
              className={open ? classes.logo : classes.logoMini}
              src={open ? (theme === 'light' ? logo : logoWhite) : theme === 'light' ? logoMini : logoMiniWhite}
              alt="Chaos Mesh"
            />
          </NavLink>

          <List className={classes.list}>
            {listItems.map(({ icon, text }) => (
              <ListItem
                key={text}
                className={clsx(classes.listItem, `tutorial-${text}`)}
                component={NavLink}
                to={`/${text}`}
                button
              >
                <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
                <ListItemText primary={i18n(`${text}.title`)} />
              </ListItem>
            ))}
          </List>
        </Box>

        <List className={classes.list}>
          <ListItem
            className={classes.listItem}
            component="a"
            href="https://chaos-mesh.org/docs"
            target="_blank"
            button
          >
            <ListItemIcon className={classes.listItemIcon}>
              <MenuBookOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={i18n('common.doc')} />
          </ListItem>

          <ListItem
            className={classes.listItem}
            component="a"
            href="https://github.com/chaos-mesh/chaos-mesh"
            target="_blank"
            button
          >
            <ListItemIcon className={classes.listItemIcon}>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="GitHub" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
