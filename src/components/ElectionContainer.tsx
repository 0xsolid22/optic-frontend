import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { VOTING_CONTRACT } from '../consts/goerli';
import useVoting from '../hooks/useVoting';
import VoteForm from './VoteForm';
import { fetchData } from '../utils/votes';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

const Notification = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Voter = {
  id: number;
  address: string;
};

type Result = {
  id: number;
  candidate: number;
  voterId: number;
};

export default function ElectionContainer() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { startTime, endTime, registered, voteResult } = useVoting(address || '');
  const [registeredVoters, setRegisteredVoters] = useState<Voter[]>([]);
  const [voteResults, setVoteResults] = useState<Result[]>([]);
  const currentTime = Date.now() / 1000;

  const fetchRegisteredVoters = async () => {
    const url = 'voters';
    const { voters }: { voters: Voter[] } = await fetchData(url);
    setRegisteredVoters([...voters]);
  };

  const fetchVoteResults = async () => {
    const url = 'results';
    const { results }: { results: Result[] } = await fetchData(url);
    setVoteResults([...results]);
  };

  useEffect(() => {
    fetchRegisteredVoters();
    fetchVoteResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (chain?.id !== 5) {
    return null;
  }

  const voteAvailable = currentTime >= startTime && currentTime <= endTime;

  return (
    <Container>
      <Box>
        <Notification
          icon={false}
          severity={registered && voteAvailable ? 'success' : 'error'}
          sx={{ fontSize: 16, mb: 2 }}
        >
          Voting Contract Address:
          <Link
            sx={{ ml: 1 }}
            color="inherit"
            href={`https://goerli.etherscan.io/address/${VOTING_CONTRACT}#code`}
            target="_blank"
            rel="noreferrer"
          >
            {VOTING_CONTRACT}
          </Link>
          <Typography component="div" sx={{ mt: 2 }} textAlign="left">
            Start Time: {new Date(startTime * 1000).toDateString()}
          </Typography>
          <Typography component="div" sx={{ mt: 2 }} textAlign="left">
            End Time: {new Date(endTime * 1000).toDateString()}
          </Typography>
          {!registered && (
            <Typography component="div" sx={{ mt: 2 }} textAlign="left">
              Not registerd yet!
            </Typography>
          )}
          {!voteAvailable && (
            <Typography component="div" sx={{ mt: 2 }} textAlign="left">
              Voting is not available
            </Typography>
          )}
        </Notification>
        {registered && voteAvailable && voteResult === 0 && (
          <Box display="flex" sx={{ mb: 4 }}>
            <VoteForm />
          </Box>
        )}
        {voteResult > 0 && (
          <Typography component="div" sx={{ mt: 2 }} textAlign="left">
            Your vote result: {voteResult}
          </Typography>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box display="flex" sx={{ mt: 2 }} alignItems="center">
            <Typography component="div" sx={{ mr: 1 }} textAlign="left">
              Registerd Voters
            </Typography>
            <IconButton
              color="primary"
              aria-label="Refresh voters"
              onClick={() => {
                fetchRegisteredVoters();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          {registeredVoters.map(({ id, address }) => (
            <Typography key={id} component="div" sx={{ mt: 1 }} textAlign="left">
              {address}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" sx={{ mt: 2 }} alignItems="center">
            <Typography component="div" sx={{ mr: 2 }} textAlign="left">
              Latest results
            </Typography>
            <IconButton
              color="primary"
              aria-label="Refresh results"
              onClick={() => {
                fetchVoteResults();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          {voteResults.map(({ id, candidate, voterId }) => {
            const voter = registeredVoters.find(({ id }) => id === voterId);
            return (
              <Typography key={id} component="div" sx={{ mt: 2 }} textAlign="left">
                Candidate: {candidate}, Voter: {voter ? voter.address : voterId}
              </Typography>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
}
