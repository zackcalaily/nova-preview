import AnchorLink from 'react-anchor-link-smooth-scroll';
import Collapse from 'react-collapse';
import Moment from 'moment';
import Numeral from 'numeral';
import React from 'react';
import Showdown from 'showdown';
import { createClient } from 'contentful';
import { Link } from 'react-router-dom';

export default class Procedure extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();

        this.ignoreFields = ['name', 'categories'];
        this.converter = new Showdown.Converter();
    }

    getInitialState = () => {
        return {
            entry: null,
            contentTypes: [],
            status: null,
            collapsedIds: [],
            relatedLinks: {
                internal: [],
                external: [],
            },
        };    
    }

    getStatus = async () => {
        const status = await this.deliveryClient.getEntry(this.state.entry.sys.id)
            .then(entry => {
                if (entry.sys.updatedAt === this.state.entry.sys.updatedAt) {
                    return 'Published';
                } else {
                    return 'Published (pending changes)';
                }
            })
            .catch(error => {
                return 'Draft';
            });
        
        this.setState({ status: status });
    }

    toggleCollapse = (id) => {
        if (this.state.collapsedIds.includes(id)) {
            const reduced = this.state.collapsedIds.filter(activityId => activityId !== id);
            this.setState({ collapsedIds: reduced });
        } else {
            const ids = [...this.state.collapsedIds];
            ids.push(id);

            this.setState({ collapsedIds: ids });
        }
    }

    getContentTypeName(id) {
        const f = this.state.contentTypes.find(t => t.sys.id === id);
        return f.name;
    }

    getRenderedFields = () => {   
        let fields = this.state.contentTypes.find(type => {
            return type.sys.id === this.state.entry.sys.contentType.sys.id
        });

        

        fields = fields.fields.filter(field => !this.ignoreFields.includes(field.id))
            .filter(field => this.state.entry.fields.hasOwnProperty(field.id));

        // Replace the two related links with one
        const internalIndex = fields.findIndex(field => field.id === 'relatedLinksInternal');
        const externalIndex = fields.findIndex(field => field.id === 'relatedLinksExternal');

        if (internalIndex > -1 || externalIndex > -1) {
            fields = fields.filter(field => field.id !== 'relatedLinksInternal' && field.id !== 'relatedLinksExternal');
            fields.push({ id: 'relatedLinks', name: 'Related Links' });
        }

        return fields;
    }

    getDepartments = () => {
        const departments = this.state.entry.fields.departments.map(department => department.fields.name);
 
        if (departments.length > 1) {
            return (
                <ul>
                    {departments.map(department => <li>{department}</li>)}
                </ul>
            );
        } else {
            return departments;
        }
    }    

    getPreProcedures = () => {
        const procedures = this.state.entry.fields.preProcedures;
        return procedures.map(procedure => this.renderProcedureSteps(procedure.fields.procedureSteps, true));
    }

    getPostProcedures = () => {
        const procedures = this.state.entry.fields.postProcedures;
        return procedures.map(procedure => this.renderProcedureSteps(procedure.fields.procedureSteps, true));
    }    

    getProbableNextSteps = () => {
        const nextSteps = this.state.entry.fields.probableNextSteps.map(step => { return { id: step.sys.id, text: step.fields.name }});
 
        if (nextSteps.length > 1) {
            return (
                <ul>
                    {nextSteps.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))
                        .map((step, index) => <li key={index}><Link to={`/procedure/${step.id}`}>{step.text}</Link></li>)}
                </ul>
            );
        } else {
            return nextSteps;
        }
    }

    getRelatedLinks = () => {
        const relatedLinks = { ...this.state.relatedLinks }
        
        return (
            <>
                <ul>
                    {relatedLinks.internal.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))
                        .map((link, index) => <li key={index}><Link to={link.url}>{link.text}</Link> in <b>{this.getContentTypeName(link.contentType)}</b></li>)}
                </ul>

                <ul>
                    {relatedLinks.external.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))
                        .map((link, index) => <li key={index}><Link to={link.url}>{link.text}</Link></li>)}
                </ul>            
            </>
        );
    }     

    renderProcedureSteps = (procedure, collapse = false) => {
        return procedure.activityOrder.map(activityId => {
            const activity = procedure.activities[activityId];
            const steps = activity.stepOrder.map(stepId => procedure.steps[stepId]);

            return (
                <div className="activity" key={activity.id}>
                    <h4 onClick={() => this.toggleCollapse(activity.id)}>{activity.name}</h4>

                    <Collapse isOpened={!this.state.collapsedIds.includes(activity.id)}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {steps.map((step, index) => {
                                    return (
                                        <tr key={step.id}>
                                            <td>{index + 1}. {step.name}</td>
                                            <td dangerouslySetInnerHTML={{ __html: step.details.replace("/\\n/g", '<br />') }}></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Collapse>

                </div>
            );
        })
    }

    componentWillReceiveProps(props) {
        this.load(props)
    }

    load = (p) => {
        // Reset state
        this.setState(this.getInitialState());

        this.previewClient = createClient({
            space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
            environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT_ID,
            accessToken: process.env.REACT_APP_CONTENTFUL_PREVIEW_TOKEN,
            host: 'preview.contentful.com'
        });

        this.deliveryClient = createClient({
            space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
            environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT_ID,
            accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
        });

        // Fetch the document
        this.previewClient.getEntry(p.match.params.id, { include: 3 })
            .then(response => {
                this.setState({ entry: response }, () => this.getStatus());
                
                // Set up collapse
                const collapsedIds = [...this.state.collapsedIds];

                ['preProcedures', 'postProcedures'].map(field => {
                    if (response.fields.hasOwnProperty(field)) {
                        response.fields[field].forEach(procedure => procedure.fields.procedureSteps.activityOrder.forEach(id => { collapsedIds.push(id) }));
                    }
                })

                const relatedLinks = { ...this.state.relatedLinks };

                if (response.fields.hasOwnProperty('relatedLinksInternal')) {
                    response.fields.relatedLinksInternal.forEach(link => {
                        relatedLinks['internal'].push({ url: `/${link.sys.contentType.sys.id}/${link.sys.id}`, text: link.fields.name || link.fields.title, contentType: link.sys.contentType.sys.id });
                    });
                }

                if (response.fields.hasOwnProperty('relatedLinksExternal')) {
                    response.fields.relatedLinksExternal.split('\n').forEach(line => {
                        const regex = /\[(.*?)\]\((.*?)\)/g;
                        const [full, text, url] = regex.exec(line);
                        
                        relatedLinks['external'].push({ url: url, text: text });
                    })
                }                

                console.log(relatedLinks);

                this.setState({ collapsedIds: collapsedIds, relatedLinks: relatedLinks });

                return this.previewClient.getContentTypes() //(response.sys.contentType.sys.id);
            })
            .then(response => this.setState({ contentTypes: response.items }));        
    }

    componentDidMount() {
        this.load(this.props);
    }
    
    render() {
        if (this.state.entry === null || this.state.status === null || this.state.contentTypes.length === 0) {
            return null;
        }

        console.log(this.state);

        return (
            <> 
                <h1>{this.state.entry.fields.name}</h1>  

                <div className="row">
                    <div className="col-lg-6">
                        <table className="metadata">
                            <tbody>
                                <tr>
                                    <td>Doc ID:</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>Version:</td>
                                    <td>{Numeral(this.state.entry.sys.revision === 0 ? 0.1 : this.state.entry.sys.revision).format('0.0')}</td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td>{this.state.status}</td>
                                </tr>
                                <tr>
                                    <td>Last Updated:</td>
                                    <td>{Moment(this.state.entry.sys.updatedAt).format('MMM D, YYYY \\a\\t h:mm A')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-lg-6">
                        <table className="metadata">
                            <tbody>
                                <tr>
                                    <td>Categories:</td>
                                    <td>{this.state.entry.fields.categories.map(category => category.fields.name).join(', ')}</td>
                                </tr>
                                <tr>
                                    <td>Audience:</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>Article Language:</td>
                                    <td>{this.state.entry.sys.locale === 'en-CA' ? 'English Canada' : 'French Canada'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>                    
                </div>

                <hr className="dashed" />

                <h3>Table of Contents</h3>
                <ul className="toc">
                    {this.getRenderedFields().map(field => (
                        <li key={field.id}>
                            <AnchorLink href={`#${field.id}`}>
                                {field.name}
                            </AnchorLink>
                        </li>
                    ))}
                </ul>

                {this.getRenderedFields().map(field => {
                    return (
                        <div key={field.id}>
                            {/* super hacky custom logic per field */}
                            <h3 id={field.id}>{field.name}</h3>
                            {field.id === 'description' ? (<p dangerouslySetInnerHTML={{ __html: this.converter.makeHtml(this.state.entry.fields[field.id]) }}></p>) : null}
                            {field.id === 'departments' ? this.getDepartments() : null}
                            {field.id === 'preProcedures' ? this.getPreProcedures() : null}
                            {field.id === 'procedureSteps' ? this.renderProcedureSteps(this.state.entry.fields.procedureSteps) : null}
                            {field.id === 'postProcedures' ? this.getPostProcedures() : null}
                            {field.id === 'probableNextSteps' ? this.getProbableNextSteps() : null}
                            {field.id === 'relatedLinks' ? this.getRelatedLinks() : null}
                        </div>
                    )
                })}
            </>
        )
    }
}