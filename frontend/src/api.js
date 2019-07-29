class API {
    constructor() {
        this.token = sessionStorage.getItem('token') || null;
        this.admin = false;
        this.discordtag = null;
        this.avatar = null;
    }

    login(token) {
        return new Promise((resolve, reject) => {
            sessionStorage.setItem('token', token);
            this.token = token;
            Promise.all([this.checkBotAdmin, this.DiscordGetMyUser])
                .then(resolve)
                .catch(console.error)
        })
    }

    logout() {
        this.dtoken = null;
    }

    checkBotAdmin() {
        return new Promise((resolve, reject) => {
            fetch('/api/admin-check', { headers: { 'Authorization' : 'Bearer ' + this.token}})
            .then(res => res.json())
            .then(res => {
                if (res.code === 0) {
                    this.admin = res.admin;
                    resolve()
                } else reject();
            })
            .catch(reject)
        });
    }

    DiscordGetMyUser() {
        return new Promise((resolve, reject) => {
            fetch('https://discordapp.com/api/v6/users/@me', { headers: { 'Authorization' : 'Bearer ' + this.token}})
            .then(res => res.json())
            .then(res => {
                this.discordtag = res.username+"#"+res.discriminator;
                this.avatar = (res.avatar) ? `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${res.discriminator % 5}.png`
                resolve();
            })
            .catch(reject)
        });
    }

    getGuilds() {

    }

    getGuildSettings() {

    }

    setGuildSettings() {

    }

    getGuildCharts() {

    }

    //just in case something went wrong during the payment, I can add the donator directly
    newDonation() {

    }
} 

export default API;