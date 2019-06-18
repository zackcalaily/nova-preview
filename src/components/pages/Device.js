import moment from 'moment';
import numeral from 'numeral';
import showdown from 'showdown';
import React from 'react';
import { createClient } from 'contentful';
import { SPACE_ID, ENVIRONMENT_ID, ACCESS_TOKEN } from '../../constants';

class Device extends React.Component {
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

    render() {
        if (this.state.entry === null) {
            return null;
        }

        return (
            <>
                <h1>{this.state.entry.fields.name}</h1>
                <hr className="dashed" />

                {/* <h3>Table of Contents</h3>
                <div className="toc">
                    <ul>
                        <li><a href="#">Overview</a></li>
                        <li><a href="#">Key Specification</a></li>
                        <li><a href="#">Rogers Market Launch Date</a></li>
                        <li><a href="#">SKU</a></li>
                        <li><a href="#">Warranty</a></li>
                        <li><a href="#">What's in the Box</a></li>
                        <li><a href="#">Images</a></li>
                        <li><a href="#">Specifications</a></li>
                    </ul>
                </div>      */}
                
                <h3>Overview</h3>
            <ul>
              {this.state.entry.fields.overview.split("\n").map((line, index) => (<li key={index}>{line}</li>))}
            </ul>

            <h3>Key Specification</h3>
            <ul>
              {this.state.entry.fields.topFeatures.split("\n").map((line, index) => (<li key={index}>{line}</li>))}
            </ul>

            <h3>Rogers Market Launch Date</h3>
            <p>{new Date(this.state.entry.fields.marketLaunchDate).toDateString()}</p>

            <h3>SKU</h3>
            <p>{this.state.entry.fields.sku}</p>

            <h3>What's in the Box</h3>
            <ul>
              {this.state.entry.fields.whatsInTheBox.split("\n").map((line, index) => (<li key={index}>{line}</li>))}
            </ul>

            <h3>Image</h3>
            <img src={this.state.entry.fields.images[0].fields.file.url} />


            <h3>Specifications</h3>
            <table>
              <thead>
                <tr>
                  <th>Specification Type</th>
                  <th>Specification Details</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.entry.fields.specifications.split("\n").map(
                    (line, index) => {
                      const p = line.split(': ');

                      return (
                        <tr>
                          <td className={(index + 1) % 2 == 0 ? 'odd' : null}>{p[0]}</td>
                          <td className={(index + 1) % 2 == 0 ? 'odd' : null}>{p[1]}</td>
                        </tr>
                      );
                    }
                  )
                }
              </tbody>
            </table>                
            </>    
        );
    }
}

export default Device;