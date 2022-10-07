const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with how to ask me things 😊')
        .addStringOption(options => 
            options.setName('function')
                .setDescription('Need help with a specific function?')
                .addChoices(
                    { name: 'music', value: 'music' },
				    { name: 'math', value: 'math' },
				    { name: 'dad', value: 'math' },
                    { name: 'flip', value: 'flip' }
                )
        ),

        async execute(interaction) {
            const funcAnswer = interaction.options.getString('function');
            console.log(funcAnswer);

            if (funcAnswer) funcAnswer.toLowerCase();

            


        }
}