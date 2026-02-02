const { SlashCommandBuilder } = require('discord.js');
const ytsr = require('ytsr');

const queues = {};

module.exports = {
	data: new SlashCommandBuilder().setName('play').setDescription('Play a song and/or video from Youtube.'),
	async execute(interaction, serverQueue) {

		const args = interaction.options.getString('song');

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {return message.channel.send('You need to be in a voice channel!');}

		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('Missing permissions');
		}
		// Get video info from Youtube
		const songInfo = await ytsr(args[1], { limit: 1 });
		const song = {
			title: songInfo.items[0].title,
			url: songInfo.items[0].url,
		};

		if (!serverQueue) {

			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
			};

			queues[message.guild.id] = queueContruct;

			queueContruct.songs.push(song);

			try {
				const connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message.guild, queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				queues[message.guild.id].songs.shift();
				if (queueContruct.songs.length === 0) {
					queues[message.guild.id].connection.disconnect();
				}
				return message.channel.send(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`${song.title} has been added to the queue!`);
		}
		// eslint-disable-next-line no-shadow
		function play(guild, song) {
			// eslint-disable-next-line no-shadow
			const serverQueue = queues[guild.id];
			if (!song) {
				serverQueue.voiceChannel.leave();
				return;
			}

			const dispatcher = serverQueue.connection
				.play(ytdl(song.url, { filter: 'audioonly' }))
				.on('finish', () => {
					serverQueue.songs.shift();
					play(guild, serverQueue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(1);
		}
	},
};