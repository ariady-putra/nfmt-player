import React from "react";
import {
  Address,
  TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-asmjs";

function ConnectWallet({setWallet, setMusicLibrary, reportStatus, reportError}) {
  const [wallets, setWallets] = React.useState(() => []);
  
  React.useEffect(() => {
    const wallets = [];
    for(const key in window.cardano) {
      if(window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
      }
    }
    setWallets(wallets.sort());
  }, []);
  
  function tryCall(call, status) {
    try {
      call(status);
    }
    catch(x) {
      console.log(JSON.stringify(x));
    }
  }
  
  return (
    <div className='ConnectWallet'>
      {!wallets.length ? 'You have no Cardano wallets installed :-(' :
        <table align='center'><tbody>
          <tr><td>Select wallet:</td></tr>
          {wallets.map(key =>
            <tr key={key}><td><button onClick={async () => {
                try {
                  tryCall(reportError, '');
                  tryCall(reportStatus, `Connecting to ${window.cardano[key].name}...`);
                  
                  const wallet        = await window.cardano[key].enable();
                  const networkID     = await wallet.getNetworkId();
                  
                  const hexAddress    = await wallet.getChangeAddress();
                  const bech32Address = Address.from_hex(hexAddress).to_bech32();
                  
                  tryCall(setWallet, {
                    api     : wallet,
                    address : hexAddress,
                    bech32  : bech32Address,
                    network : networkID,
                  });
                  tryCall(reportStatus, 'Browsing music...');
                  
                  const utxoS = await wallet.getUtxos();
                  let musicLibrary = [];
                  
                  for(const utxo of utxoS) {
                    const output = TransactionUnspentOutput.from_hex(utxo).output().to_js_value();
                    if(output.amount && output.amount.multiasset)
                    {
                      for(const [policyID, asset] of output.amount.multiasset.entries()) {
                        for(const [assetName, amount] of asset.entries()) {
                          if(amount === '1') {
                            const specificAsset = await fetch(`/specificAsset?policy_id=${policyID}&asset_name=${assetName}`);
                            const asset = await specificAsset.json();
                            if(asset.onchain_metadata && asset.onchain_metadata.song_title)
                              // for(let i = 0; i < 10; i++)
                              musicLibrary.push(asset.onchain_metadata);
                          }
                        }
                      }
                    }
                  }
                  
                  setMusicLibrary(musicLibrary.sort());
                }
                catch(x) {
                  tryCall(reportError, JSON.stringify(x, null, 4));
                }
                finally {
                  tryCall(reportStatus, '');
                }
              }}
              ><table><tbody><tr><td><img
                src  ={window.cardano[key].icon}
                width={32} height={32} alt={key}/>
              </td><td>
                {window.cardano[key].name}
              </td></tr></tbody></table>
            </button></td></tr>
          )}
        </tbody></table>
      }
    </div>
  );
}

export default ConnectWallet;
