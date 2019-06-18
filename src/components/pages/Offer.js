import moment from 'moment';
import numeral from 'numeral';
import showdown from 'showdown';
import React from 'react';
import { createClient } from 'contentful';
import { SPACE_ID, ENVIRONMENT_ID, ACCESS_TOKEN } from '../../constants';

class Offer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: null,
        }

        this.converter = new showdown.Converter();
    }    

    componentDidMount() {
        const client = createClient({
            space: SPACE_ID,
            environment: ENVIRONMENT_ID,
            accessToken: ACCESS_TOKEN
        });

        client.getEntry(this.props.match.params.id, { include: 3 })
            .then(response => this.setState({ entry: response }));
    }

    getColumnsForProduct(product) {
        const columns = [];
        const scope = this.state.entry.fields.offer.fields.pricing.filter(price => price.fields.product === product);

        scope.forEach(s => {
            columns.push(<td>${numeral(s.fields.basePrice).format('0.00')}</td>);
            columns.push(<td className="red">${numeral(s.fields.discount).format('0.00')}</td>);
            columns.push(<td><strong>${numeral(Math.max(s.fields.basePrice - s.fields.discount, 0)).format('0.00')}</strong></td>);
        })

        return columns;
    }    

    render() {
        if (this.state.entry === null) {
            return null;
        }

        console.log(this.state.entry);

        let priceHeaders = [];

        for (let i = 0; i < 4; i++) {
            priceHeaders.push(
                <>
                    <th>Regular Price</th>
                    <th>Discount</th>
                    <th>Discounted<br />Price</th>
                </>
            );
        }

        return (
            <>
                <h1>{this.state.entry.fields.title}</h1>
                <hr className="dashed" />              

                <h3>Description</h3>
                <p>{this.state.entry.fields.description}</p>

                <h3>Code</h3>
                <table>
                    <thead>
                        <tr>
                            <th width="10%">Code</th>
                            <th width="30%">Who CAN Get It</th>
                            <th width="30%">Who CANNOT Get It</th>
                            <th width="15%">Launch Date</th>
                            <th width="15%">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td align="center"><strong>{this.state.entry.fields.offer.fields.code}</strong></td>
                            <td>{this.state.entry.fields.offer.fields.eligible}</td>
                            <td><ul>{this.state.entry.fields.offer.fields.nonEligible.split("\n").map((item, index) => <li key={index}>{item}</li>)}</ul></td>
                            <td align="center">{moment(this.state.entry.fields.offer.fields.launchDate, 'YYYY-MM-DD').format('MMM D, YYYY')}</td>
                            <td align="center">
                                {
                                    this.state.entry.fields.offer.fields.hasOwnProperty('endDate') ? 
                                        moment(this.state.entry.fields.offer.fields.endDate, 'YYYY-MM-DD').format('MMM D, YYYY') :
                                        'Ongoing'
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Offer Details</h3>
                <p dangerouslySetInnerHTML={{ __html: this.converter.makeHtml(this.state.entry.fields.offerDetails) }}></p>

                <h3>Fees</h3>
                <ul>{this.state.entry.fields.offer.fields.fees.map((fee, index) => <li key={index}>{fee.fields.description} of ${fee.fields.amount} {fee.fields.hasOwnProperty('taxesApplicable') ? 'plus taxes ' : null}applies</li>)}</ul>

                <h3>Pricing</h3>
                <table className="pricing">
                    <thead>
                        <tr>
                            <th rowSpan="2">&nbsp;</th>
                            <th colSpan="3">Starter</th>
                            <th colSpan="3">Select</th>
                            <th colSpan="3">Popular</th>
                            <th colSpan="3">Premier</th>
                        </tr>
                        <tr>
                            {priceHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Ignite 150u</td>
                            {this.getColumnsForProduct('Ignite 150u')}
                        </tr>
                        <tr>
                            <td>Ignite 500u</td>
                            {this.getColumnsForProduct('Ignite 500u')}
                        </tr>
                        <tr>
                            <td>Ignite Gigabit</td>
                            {this.getColumnsForProduct('Ignite Gigabit')}
                        </tr>                        
                    </tbody>
                </table>   
                
                <h3>Points to Mention</h3>
                <p dangerouslySetInnerHTML={{ __html: this.converter.makeHtml(this.state.entry.fields.pointsToMention) }}></p>                
            </>    
        );
    }
}

export default Offer;