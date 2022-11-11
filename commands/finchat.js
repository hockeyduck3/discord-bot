const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('f')
            .setDescription('Need to get an F in the chat? Or do you need to give an F to another user? I got you! 😤')
            .addUserOption(user =>
                user.setName('for')
                    .setDescription('Wanna get an F in chat for a user?')    
            ),

            async execute(interaction) {
                const initUser = interaction.user.username;
                const user = interaction.options.getUser('for');

                const userResponseArr = [
                    `Dear ${user}, ${initUser} would like you to have this "F".`,
                    `${initUser} has asked us all to give an "F" to the one and only ${user}.`,
                    `${initUser} asked me to give you this "F" ${user}.`,
                    `Dear ${user}, "F". Love, ${initUser}.`,
                    `Yo ${user}, ${initUser} sends you this "F".`,
                    `Dearly beloved ${initUser} has gathered us here today to give this "F" to ${user}`,
                    `Dear ${user}, ${initUser} has been trying to reach you about your car's extended warrenty. Sorry... I mean this "F".`,
                    `${user}, "F". From ${initUser}`,
                    `${user} You got an "F" from ${initUser}!`,
                    `Hi ${user}, you have been served this "F" from ${initUser}`,
                    `${initUser} would like to get an "F" in the chat for ${user}`
                ];

                const normalResponseArr = [
                    'F',
                    'https://media.giphy.com/media/hStvd5LiWCFzYNyxR4/giphy.gif',
                    'https://media.giphy.com/media/tw2j043hUE2wqkCl5X/giphy.gif',
                    'https://media.giphy.com/media/l0Ex15F9pc1LNeGT6/giphy.gif',
                    'https://media.giphy.com/media/gLoMzjGQB2tQlQtB9P/giphy.gif',
                    'https://media.giphy.com/media/l3fzM2wgd6TygHbYA/giphy.gif',
                    'https://media.giphy.com/media/Y7lSvRrJhDRE4/giphy.gif',
                    'https://media.giphy.com/media/LXpmVImP06400/giphy.gif',
                    'https://media.giphy.com/media/MY6MpD4YDuigatKNGh/giphy.gif',
                    'https://media.giphy.com/media/jpkPzF1XaHXcVGTFzJ/giphy.gif',
                ]

                if (user != null) {
                    interaction.reply(userResponseArr[Math.floor(Math.random() * userResponseArr.length)]);
                } else {
                    interaction.reply(normalResponseArr[Math.floor(Math.random() * normalResponseArr.length)]);
                }
            }
}
