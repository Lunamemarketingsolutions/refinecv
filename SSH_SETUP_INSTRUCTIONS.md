# SSH Setup Instructions for GitHub

## Step 1: Add SSH Key to GitHub

1. **Copy your public SSH key** (displayed below)
2. Go to GitHub: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Fill in:
   - **Title**: "MacBook Air" (or any name you prefer)
   - **Key**: Paste the public key below
5. Click **"Add SSH key"**

## Your Public SSH Key

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIN61pBLd+HOaJJO60Z9HMQ4Bt3LMAGonTG2BxFm+M1E4 shwetajha@Shwetas-MacBook-Air.local
```

**Copy the entire line above** (starting with `ssh-ed25519` and ending with your email)

## Step 2: Test Connection

After adding the key to GitHub, test the connection:

```bash
ssh -T git@github.com
```

You should see: "Hi Shweta151434! You've successfully authenticated..."

## Step 3: Push Your Changes

Once SSH is set up, you can push:

```bash
git push origin Shwetajha
```

## Troubleshooting

**If connection fails:**
- Make sure you added the public key to GitHub
- Wait a few seconds after adding (GitHub needs to sync)
- Try: `ssh -T git@github.com` again

**If you need to see your public key again:**
```bash
cat ~/.ssh/id_ed25519.pub
```

## Security Notes

- ✅ Private key (`~/.ssh/id_ed25519`) stays on your machine - never share it
- ✅ Public key (`~/.ssh/id_ed25519.pub`) is safe to add to GitHub
- ✅ Once set up, you won't need passwords for Git operations
- ✅ SSH is more secure than HTTPS with tokens

