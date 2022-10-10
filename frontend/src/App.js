import React from 'react';
import ConnectWallet from './component/ConnectWallet';
import MusicPlaylist from './component/MusicPlaylist';
import ShowStatus from './component/ShowStatus';
import ShowError from './component/ShowError';

import './App.css';

function App() {
  const [wallet, setWallet] = React.useState();
  const [musicLibrary, setMusicLibrary] = React.useState();
  
  const [status, setStatus] = React.useState();
  const [error, setError] = React.useState();
  
  function reset() {
    setWallet();
    setMusicLibrary();
    setStatus();
    setError();
  }
  
  return (
    <div className='App'>
      {!wallet && <ConnectWallet
        setWallet={setWallet}
        setMusicLibrary={setMusicLibrary}
        reportStatus={setStatus}
        reportError={setError}/>
      }
      {status && <ShowStatus
        status={status}/>
      }
      {error && <ShowError
        error={error}/>
      }
      {musicLibrary && <MusicPlaylist
        library={musicLibrary}
        disconnect={reset}/>
      }
    </div>
  );
}

export default App;
