const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = { 
    name: "help",
    aliases: ["h", "ayuda"],
    category: "informacion",
    description: "Muestra todos los comandos o mustra la informacion de uno en espesifico",
    usage: "[comando | alias]",
    run: async (client, message, args) => {
       if(args[0]){
           return getCMD(client, message, args[0])
       } else {
           return getAll(client, message)
       }
    }
}

function getAll(client, message){
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setThumbnail("https://i.imgur.com/vDnxgsJ.gif")
    .setTimestamp()
    .setTitle(`Ayuda de ${client.user.username} || Comandos totales: ${client.commands.size}`)
    .setFooter(`Para ver las descripciones de los comandos y el tipo de uso utiliza re¡help [Nombre del CMD]`)

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${cmd.name}\``)
            .join(", ")
    }
 
    const info = client.categories 
    .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
    .reduce((string, category) => string + "\n" + category)
    return message.channel.send(embed.setDescription(info))
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()
    
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `No hay informacion para el comando \`${input.toLowerCase()}\``;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }
var img; 
var cat;
if(cmd.name) info = `Nombre del comando: ${cmd.name}`;
if(cmd.category) { cat = cmd.category} else { cat = "No definida"}
if(cmd.aliases) info = `\nAlias: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}\n`;
if(cmd.description) info += `\nDescripcion: ${cmd.description}\n`;
if(cmd.bperms) info += `\n\nPermisos que debe tener el bot: \`${cmd.bperms}\`\n`
if(cmd.uperms) info += `\n\nPermisos que debe tener el usuario \`${cmd.uperms}\`\n`
if(cmd.img) { img = cmd.img } else { img = "https://i.imgur.com/07IGi6Q.gif"}
if(cmd.usage){
    info += `\nUso: ${cmd.usage}\n `;
    embed.setFooter(`Syntax: <> = requerido, [] = opcional, () = notas`)
}
return message.channel.send(embed.setColor("GREEN").setDescription(info).setThumbnail(img).setAuthor(`Caregoria: ${cat} || ${cmd.name} `))
}