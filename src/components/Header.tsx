import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { formatAddress } from '../utils/votes';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  return (
    <Box sx={{ flexGrow: 1 }} mb={4}>
      <AppBar position="static" sx={{ px: 2, py: 1 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} textAlign="left">
            Optic Election
          </Typography>
          {isConnected && chain?.id !== 5 && (
            <Typography variant="h6" color={'darkorange'} component="div" sx={{ flexGrow: 1 }} textAlign="left">
              Unsupported Network - connect to Goerli
            </Typography>
          )}
          {isConnected ? (
            <div>
              <Button
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {formatAddress(address || '')}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    disconnect();
                    handleClose();
                  }}
                >
                  Disconnect
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" onClick={() => connect()}>
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
