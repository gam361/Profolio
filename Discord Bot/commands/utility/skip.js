const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skip the currently playing song/video.'),
	async execute(interaction, serverQueue) {
		if (!interaction.member.voice.channel) {
			return interaction.channel.send(
				'You have to be in a voice channel to skip the music!',
			);
		}

		if (!serverQueue) {
			return interaction.channel.send('There is no song I could skip!');
		}

		serverQueue.connection.dispatcher.end();
	},
};