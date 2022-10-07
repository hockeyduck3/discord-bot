const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const mathMap = new Map();

let calc;

const bottomRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('.')
            .setLabel('.')
            .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('0')
            .setLabel('0')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('=')
            .setLabel('=')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('+')
            .setLabel('+')
            .setStyle(ButtonStyle.Primary)
    );


const thirdRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('1')
            .setLabel('1')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('2')
            .setLabel('2')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('3')
            .setLabel('3')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('-')
            .setLabel('-')
            .setStyle(ButtonStyle.Primary)
    );

const secondRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('4')
            .setLabel('4')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('5')
            .setLabel('5')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('6')
            .setLabel('6')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('*')
            .setLabel('x')
            .setStyle(ButtonStyle.Primary)
    );

const firstRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('7')
            .setLabel('7')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('8')
            .setLabel('8')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('9')
            .setLabel('9')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('/')
            .setLabel('/')
            .setStyle(ButtonStyle.Primary)
    );

const topRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('(')
            .setLabel('(')
            .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId(')')
            .setLabel(')')
            .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('%')
            .setLabel('%')
            .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('AC')
            .setLabel('AC')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Not fast at math? Don\'t worry, I can help with that 😎'),

        async execute(interaction) {
            const collector = interaction.channel.createMessageComponentCollector();

            let screen = new EmbedBuilder()
                    .setAuthor({ name: 'Tilly Calculator' })
                    .setDescription('``` ```');
                    

            collector.on('collect', async i => {
                if (i.customId != '=') {
                    if (calc != undefined) {
                        calc = `${calc}${i.customId}`;
                        screen.setDescription('```' + calc + '```')
                    } else {
                        calc = i.customId;
                        topRow.components[3].data.disabled = false;
                        screen.setDescription('```' + calc + '```')
                    }

                    if (i.customId == 'AC') {
                        calc = undefined;
                        topRow.components[3].data.disabled = true;
                        screen.setDescription('``` ```')
                    }
                } else {
                    try {
                        const result = eval(calc);
    
                        screen.setDescription('```' + result + '```');

                        bottomRow.components[2].data.disabled = true;
                    } catch (err) {
                        console.log(err);
                        screen.setDescription('```' + 'error' + '```');
                    }
                }


                /([0-9][)(+\-\/x])/.test(calc) ? bottomRow.components[2].data.disabled = false : bottomRow.components[2].data.disabled = true;

                i.deferUpdate();

                interaction.editReply({
                    embeds: [screen],
                    components: [topRow, firstRow, secondRow, thirdRow, bottomRow],
                    ephemeral: true
                })
            });

            interaction.reply({
                embeds: [screen],
                components: [topRow, firstRow, secondRow, thirdRow, bottomRow],
                ephemeral: true
            })
        }
}