import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import ElectionContainer from './components/ElectionContainer';

import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli],
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY || '' }), publicProvider()]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="App">
          <Header />
          <ElectionContainer />
        </div>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
