const { Client, Collection, MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const config = require("./config.json");
const fs = require("fs");
const client = new Client({
    disableMentions: "everyone"
});
const emojis = require("./datos/emojis.json")
const notificaciones_canal = client.channels.cache.get("775505367404511254")

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client)
});

client.once("ready", () => {
    console.log(`${client.user.username} esta listo y prendido `)
    client.channels.cache.get("775505367404511254").send(new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription(`${emojis.listo} ${client.user.username} ah prendido ${emojis.listo}`)
    .setTimestamp())
    client.user.setPresence({
        status: "dnd",
        activity: `${config.prefix}help`
    })
});

client.on("guildCreate", async servidor => {
    client.channels.cache.get("775505367404511254").send(new Discord.MessageEmbed()
    .setDescription(`Se me agrego a un nuevo servidor`)
    .addFields(
        {
            name: "Servidor",
            value: `${servidor.name}`
        },
        {
            name: "Total de servidores",
            value: `${client.guilds.cache.size}`
        }
    )
    .setTimestamp()
    .setColor("BLUE"))
})

client.on("message", async message => {
    const prefix = (config.prefix);
    if(message.author.bot) return;
    if(!message.guild) return;
    let RegMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if(message.content.match(RegMention)){
        return message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`<:rei_ping:847273113455427604> Hola mi prefijo es \`${prefix}\` puedes usar \`${prefix}help\` para ver mis comandos <:rei_ping:847273113455427604>`))
    }
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) {
        client.channels.cache.get("775505367404511254").send(new Discord.MessageEmbed()
        .setAuthor(client.user.tag, client.user.avatarURL())
        .setDescription("Se ah usado un comando")
        .addFields(
            {
                name: "Servidor",
                value: `${message.guild.name}`
            },
            {
                name: "Comando",
                value: `${command.name}`
            }
        )
        .setColor("BLUE"))
        try{
            command.run(client, message, args)
        } catch (e) { 
            return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.user.username ,message.member.user.avatarURL())
            .setDescription(`No he encontrado ningún comando con el nombre "${command.name}",  por favor revisa si está bien escrito.`)
            .setColor("RED")
            .setFooter(`Usa ${config.prefix}help para ver mis comandos`))
         }
    }  else {
        message.channel.send(new Discord.MessageEmbed()
        .setAuthor(message.member.user.username ,message.member.user.avatarURL())
        .setDescription(`No he encontrado ningún comando con el nombre "${cmd}",  por favor revisa si está bien escrito.`)
        .setColor("RED")
        .setFooter(`Usa ${config.prefix}help para ver mis comandos`))
    } 
});

client.login(config.token);