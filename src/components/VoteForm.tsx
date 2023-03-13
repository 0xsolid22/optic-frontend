import { useState } from 'react';
import { ethers } from 'ethers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';

import { CANDIDATES_COUNT, VOTING_CONTRACT } from '../consts/goerli';
import votingABI from '../utils/VotingABI.json';

type Inputs = {
  candidate: number;
};

type ErrorWithReason = {
  reason: string;
};

const schema = yup
  .object({
    candidate: yup.number().positive().required().min(1).max(CANDIDATES_COUNT).integer(),
  })
  .required();

export default function VoteForm() {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      candidate: 0,
    },
  });
  const [open, setOpen] = useState(false);

  const watchedCandidate = Number(watch('candidate', 0));
  const candidate = isNaN(watchedCandidate) ? 0 : watchedCandidate;

  const { config, error, isFetching, isError } = usePrepareContractWrite({
    address: VOTING_CONTRACT,
    abi: votingABI,
    functionName: 'vote',
    args: [candidate],
  });

  const { write } = useContractWrite(config);

  const onSubmit: SubmitHandler<Inputs> = async () => {
    if (write) {
      write();
    }
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="success" sx={{ mr: 4 }} onClick={handleClickOpen}>
        Vote
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ minWidth: '350px' }}>Vote</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter candidate number(1 - 15).</DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="candidate"
              label="Candidate"
              fullWidth
              variant="standard"
              {...register('candidate')}
            />
            {errors.candidate && (
              <Typography color="red" role="alert">
                Invalid candidate number
              </Typography>
            )}
            {!errors.candidate && error && (
              <Typography color="red" role="alert">
                {(error as unknown as ErrorWithReason)['reason']}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={isFetching || isError} type="submit">
              Vote
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
