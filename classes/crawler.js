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
        var internet
        var ligacao
        $('.notMobile').find('ul').first().each((i, element) => {
            var item = $(element).text().trim()
            if(item.match(/[0-9]\GB/g)){
                internet = (item.match(/[0-9]\GB/g))
            }
            if(item.match(/ligações/g)){
                ligacao = item
                if(ligacao.match(/ilimitado/g)){
                ligacao = -1
                }
                else 
                { 
                    ligacao=ligacao.match(/\d/g).join('')
                }
            }
        })
           
        // TODO: Fill this object with the parsed data
        return {
           plan_price: $('.fullPrice').text(), 
           internet: internet, 
           minutes: ligacao,
        }
    }

    /**
     * Loop benefits list and parse data using regex
     * 
     * @param {*} $ 
     * @return array with all benefits
     */
    parsePlanBenefits($) {
        var beneficio = new Array()
        $('.notMobile').find('ul').find('li').each((i, element) => {
            const item = $(element).text()
            if(item.match(/Roaming/g) || item.match(/SMS/g) || item.match(/Motoboy/g) || item.match(/Seguro/g) || item.match(/Reserva/g)){
                beneficio.push(item)
            }
        })
        return beneficio
    }
}
