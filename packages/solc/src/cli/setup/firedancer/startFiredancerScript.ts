const startFiredancerScript = () => {
  const filePath = '/home/solc/start-firedancer.sh'
  const body = `#!/usr/bin/env bash
sudo chmod -R 700 /mnt
sudo fdctl configure init all --config /home/solc/firedancer/config.toml
sudo chown -R solc:solc /mnt
sudo fdctl run --config /home/solc/firedancer/config.toml`
  return {
    filePath,
    body,
  }
}

export default startFiredancerScript
