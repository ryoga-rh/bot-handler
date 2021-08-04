const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["latencia"],
    description: "Muestra la latencia del bot",
    category: "informacion",
    run: async (clien, message, args) => {
        const ping = new Discord.MessageEmbed()
        .setDescription(`Mi latencia es de ${Math.round(client.ws.ping)}`)
        .setColor("BLUE")
        .setTimestamp()
        try {
            const adejar = await message.channel.send(ping)
            await adejar.react("✅")
        } catch (e){
            message.channel.send(`Ocurrio un error ${e}`)
        }
    }
}