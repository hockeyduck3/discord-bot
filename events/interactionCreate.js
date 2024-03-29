module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if(!interaction.isCommand() && !interaction.isButton()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.log(err);

            await interaction.reply({
                content: 'There was an error with that message',
                ephemeral: true
            });
        }
    }
}