import React from 'react';

function MusicPlaylist({library, disconnect}) {
  const [song, setSong] = React.useState();
  
  return (
    <div className='MusicPlaylist'>
      <table style={{width:'100%', height:window.innerHeight, borderSpacing:'0px', tableLayout:'fixed'}}><tbody><tr>
        <td style={{width:'25%', height:'100%', padding:'0px 0px 0px 0px'}}>
          <table style={{width:'100%', height:'100%', borderSpacing:'0px', tableLayout:'fixed'}}><tbody>
            <tr style={{height:'100%'}}><td className='BoxShadow' style={{verticalAlign:'top', padding:'0px 0px 0px 0px'}}>
              <div style={{height:'100%', overflow:'auto'}}>
                {library.map(music => {
                  return <button key={music.name} onClick={() => {
                    setSong(); // force reset song each time
                    setTimeout(() => setSong(music), 1);
                  }}>
                    <table><tbody>
                      <tr><td className='SongTitle'>{music.song_title}</td></tr>
                      <tr><td className='SongArtists'>{music.artists}</td></tr>
                    </tbody></table>
                  </button>
                })}
              </div>
            </td></tr>
            <tr><td className='BoxShadow' style={{verticalAlign:'middle', padding:'0px 0px 0px 0px'}}>
              <button onClick={() => disconnect()}>Disconnect</button>
            </td></tr>
          </tbody></table>
        </td>
        <td className='BoxShadow' style={{width:'75%', height:'100%', verticalAlign:'middle', padding:'0px 0px 0px 0px'}}>
          {!library.length ? 'No music NFT was found from this wallet :-(' :
          song && <div style={{maxHeight:window.innerHeight, overflow:'auto'}}>
            <h1>{song.song_title}</h1>
            <h2>{song.artists}</h2>
            <img className='BoxShadow'
              src={`https://gateway.pinata.cloud/ipfs/${song.image.replace('ipfs://', '')}`}
              alt={song.name}
              height={document.documentElement.clientHeight/2}
            />
            <br/>
            <sup>{song.copyright}</sup>
            <br/>
            <audio autoPlay={true} controls={true} onEnded={() => {
              setSong();
              setTimeout(() => setSong(library[Math.floor(Math.random() * library.length)]), 1);
            }}>
              <source
                src={`https://gateway.pinata.cloud/ipfs/${song.files[0].src.replace('ipfs://', '')}`}
                type={song.files[0].mediaType}/>
              {'Your browser does not support the audio element :-('}
            </audio>
          </div>}
        </td>
      </tr></tbody></table>
    </div>
  );
}

export default MusicPlaylist;
