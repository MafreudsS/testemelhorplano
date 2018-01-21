"use strict";

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

module.exports = class Crawler {
    constructor() {
        const html = this.retrieveHtml()
        const $ = this.parseHtmlToCheerio(html)
    
        const parsedPlan = this.parsePlan($)
        
        return parsedPlan
    }

    /**
     * Get html contents from assets directory
     * 
     * @return html source content
     */
    retrieveHtml() {
        const html = fs.readFileSync('./assets/plano.html', 'utf-8')
        return html
    }

    /**
     * Get source html and parse to cheerio,
     * to manipulate the html using jquery functions
     * 
     * @param {*} html
     * @return html parsed to cheerio
     */
    parseHtmlToCheerio(html) {
        const $ = cheerio.load(html)
        return $
    }

    /**
     * Parse the html, and return plan parsed
     * 
     * @param {*} $
     * @return json formatted plan
     */
    parsePlan($) {
        const planInformationParsed = this.parsePlanInformation($)
        const planBenefitsParsed = this.parsePlanBenefits($)

        return {
            ...planInformationParsed,
            benefits: planBenefitsParsed
        }
    }

    /**
     * Loop the list and parse the data using regex
     * 
     * @param {*} $ 
     * @return formatted JSON
     */
    
    parsePlanInformation($) {
        var lista = new Array()
        $('.notMobile').find('ul').first().find('li').each((i, element) => {
            var item = $(element).text().trim()
            lista.push(item)

        })
        var str = lista[0].search('ilimitado')
        var ax1
        if(str!=-1){
            ax1 = -1
        }
        else {
            //ax1=lista[0].match(/\d/g).join('') - > Pegando apenas os numeros da string caso não seja ilimitado.
            ax1=lista[0]
        }
           
        // TODO: Fill this object with the parsed data
        return {
           plan_price: $('.fullPrice').text(), 
           internet: lista[3], 
           minutes: ax1,
        }
    }

    /**
     * Loop benefits list and parse data using regex
     * 
     * @param {*} $ 
     * @return array with all benefits
     */
    parsePlanBenefits($) {
        var lista = new Array()
        $('.notMobile').find('ul').last().find('li').each((i, element) => {
            const item = $(element).text().trim()
            lista.push(item)
        })

        var lista1 = new Array()
        $('.notMobile').find('ul').first().find('li').each((i, element) => {
            var item = $(element).text().trim()
            lista1.push(item)

        })

        // TODO: Fill this with the benefits parsed
        return [lista[0],lista[1],lista[2],lista1[1],lista1[2]]
    }
}