const { Kayn } = require('kayn')
const kayn = Kayn('RGAPI-d16549fb-6a5c-432d-94a6-51f6f6d70fa0')(/* optional config */)

const sortByIncWins = (a, b) => b.leaguePoints - a.leaguePoints
const sortByIncPoints = (a, b) => b.championPoints - a.championPoints
const winrate = (a) => a.wins / (a.wins + a.losses) * 100

const createHTML = (content, type, local) => {
    var tag = document.createElement(type)
    var text = document.createTextNode(content)
    tag.appendChild(text)
    var element = document.getElementById(local)
    element.appendChild(tag)
}

const createTable = (content) => {
    var tag = document.createElement("tr")
    tag.id = content
    var element = document.getElementById("infoBody")
    element.appendChild(tag)
}

const main = async Kayn => {
    const { n: { champion: championVersion } } = await kayn.DDragon.Realm.list()
    const ddragonChampions = await kayn.DDragon.Champion.listDataByIdWithParentAsId().version(championVersion)
    const challengerLeague = await kayn.Challenger.list('RANKED_SOLO_5x5')
    const grandmasterLeague = await kayn.Grandmaster.list('RANKED_SOLO_5x5')
    const leagueEntries = challengerLeague.entries.concat(grandmasterLeague.entries)
    const players = leagueEntries.sort(sortByIncWins)

    for (let i in players) {
    const { id, summonerLevel, accountId } = await kayn.Summoner.by.name(players[i].summonerName)
    const getMastery = await kayn.ChampionMastery.list(id)
    const scores = getMastery.sort(sortByIncPoints)
    const champion = ddragonChampions.data[scores[0].championId].name
    const totalWinrate = winrate(players[i])
    const totalConfig = { query: 420 }
    const champConfig = { query: 420, champion: scores[0].championId }
    const totalMatch = await kayn.Matchlist.by.accountID(accountId).query(totalConfig)
    const champMatch = await kayn.Matchlist.by.accountID(accountId).query(champConfig)

    if (totalWinrate >= 60){
    createTable(players[i].summonerId)
    createHTML(players[i].summonerName, "td", players[i].summonerId)
    createHTML("Challenger", "td", players[i].summonerId)
    createHTML(players[i].leaguePoints, "td", players[i].summonerId)
    createHTML(summonerLevel, "td", players[i].summonerId)
    createHTML(champion, "td", players[i].summonerId)
    createHTML(scores[0].championPoints, "td", players[i].summonerId)
    createHTML(`${totalWinrate.toFixed(2)}%`, "td", players[i].summonerId)
    }}
}

main()