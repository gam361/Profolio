const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('Stop the music and leave the voice channel.'),
	async execute(interaction, serverQueue) {
		if (!interaction.member.voice.channel) {
			return interaction.channel.send(
				'You have to be in a voice channel to stop the music!',
			);
		}

		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};