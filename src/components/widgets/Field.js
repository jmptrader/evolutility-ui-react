// Evolutility-UI-React :: /widgets/Field.js

// Model-driven field (possible types specified in dico.fieldTypes).

// https://github.com/evoluteur/evolutility-ui-react
// (c) 2018 Olivier Giulieri

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import format from 'utils/format'
import { i18n_actions, i18n_msg } from '../../i18n/i18n'
import { filesUrl } from '../../config.js'
import FieldLabel from './FieldLabel'

// - components:
// - date
import Datepicker from 'react-datepicker'
import moment from 'moment'
// - image & documents
import Dropzone from 'react-dropzone'


import './field.scss'


function emHeight(f){
	let fh = parseInt(f.height || 2, 10);
	if(fh<2){
		fh=2;
	}
	return Math.trunc(fh*1.6);
}

function createMarkup(d) {
	// TODO: good enough?
	return {__html: d?d.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>'):''}
}

function createOption(opt){
	return <option key={opt.id} value={''+opt.id}>{opt.text}</option>
}

export default class Field extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			help: false
		}
		this.clickHelp = this.clickHelp.bind(this);
		//TODO: more???
		this.onDropFile = this.onDropFile.bind(this);
		this.removeFile = this.removeFile.bind(this);
	}

	_fieldElem(f, d, cbs){
		// - return the widget needed for the specific field type
		const usualProps = {
			id: f.id,
			key: f.id,
			ref: 'e',
		}

		if(f.type==='boolean'){
			return <input {...usualProps}
						type="checkbox" 
						checked={d?true:false}
						onChange={cbs.change}
				    />
		}else if(f.type==='textmultiline' || f.type==='json'){ // && f.height>1
			return <textarea {...usualProps}
						rows={f.height} 
						className="form-control" 
						value={d?d:''} 
						onChange={cbs.change}
					/>
		}else if(f.type==='lov'||f.type==='list'){
			let opts

			if(f.list){
				opts = f.list.map(createOption)
			}else{
				const optVal = {
					id:f.id+'loading', 
					text: i18n_msg.loading
				}
				opts = [createOption(optVal)]
				f.list = [optVal]
			}
			return <select {...usualProps}
						className="form-control" 
						value={d || ''}
						onChange={cbs.change}
					>
						<option/>
						{opts}
					</select>

		}else if(f.type==='date'){
			return <Datepicker {...usualProps}
						className="form-control" 
						selected={d ? moment(d, "YYYY-MM-DD") : null}
						onChange={this.getDateFieldChange(f.id)}
					/>
		}else if(f.type==='image' || f.type==='document'){
			let pix = null

			if(d){
				if(f.type==='image' && d){
					pix = <img {...usualProps}
								className="img-thumbnail"
								src={filesUrl+d}
								alt="" 
							/>
				}else{
					pix = format.doc(d, filesUrl)
				}
			}

			return (
				<div>
					{pix}
					{d ? (
						<div className="evol-remove" onClick={this.removeFile}>
							<a className="fakeLink">
								<i className="glyphicon glyphicon-remove"/>
								{i18n_actions['remove_'+f.type]}
							</a>
						</div> 
						) : null}
					<Dropzone ref="dropzone" model={f} onDrop={this.onDropFile} className="pixdrop">
	                  <i>{i18n_actions.dropFile}</i>
	                </Dropzone>
				</div>
			)
		}
		let inputType
		if(f.type==='integer' || f.type==='decimal'){
			inputType = 'number'
		}else{  //if(f.type==='email'){
			inputType = 'text'
		}
		
		return <input {...usualProps}
				type={inputType} 
				value={d?d:''}
				onChange={cbs.change}
				className="form-control"
			/>

	}

	_fieldElemReadOnly(f, d, d_id){
		// - return the formated field value
		let fw

		if(f.type==='textmultiline'){
			const height = emHeight(f)+'em'
			return <div key={f.id} className="disabled evo-rdonly" style={{height:height}}
					dangerouslySetInnerHTML={createMarkup(d)}
				/> 
		}else if(f.type==='image' && d){
			fw = format.image(filesUrl+d)
		}else if(f.type==='document'){
			fw = format.doc(d, filesUrl)
		}else if(f.type==='lov' && f.entity){
			//{f.country_icon && d.country_icon ? <img src={d.country_icon}/> : null}
			fw = <Link to={'/'+f.entity+'/browse/'+d_id}>
					{format.fieldValue(f, d)}
				</Link>
		}else {
			fw = format.fieldValue(f, d)
		}
		return (
			<div key={f.id} className="disabled evo-rdonly">
				{fw}
			</div>
		)
	}

	clickHelp(){
		this.setState({
			help: !this.state.help
		})
		this.clickHelp = this.clickHelp.bind(this)
	}

 	render() {
		const f = this.props.model || {type: 'text'},
			readOnly = this.props.readOnly || f.readOnly,
			cbs = this.props.callbacks || {},
			value = this.props.value || null,
			valueId = this.props.valueId || null,
			invalid = this.state.invalid,
			label = this.props.label || f.label

		return (
			<div className={'evol-fld'+(invalid?' has-error':'')} style={{width: (f.width || 100)+'%'}}>

				<FieldLabel label={label} 
					field={f}
					readOnly={readOnly}
					clickHelp={this.clickHelp}/>

				{f.help && this.state.help ? <div className="help-block"><i>{f.help}</i></div> : null}

				{readOnly ? this._fieldElemReadOnly(f, value, valueId)
								 : this._fieldElem(f, value, cbs)}

 				{invalid ? <div className="text-danger">{this.state.message}</div> : null}

			</div>
		)
	}

	getDateFieldChange(fid) {
		// - for fields of type date (using react-datepicker)
		return (v)=>{
			this.props.callbacks.change({
				target:{
					id: fid, 
					value: v ? v.format() : null
				}
			})
		}
	}

	onDropFile(files){
		// - only for fields of type image or document
		const f = this.props.model
		if(files.length && (f.type==='image' || f.type==='document')){
			const formData = new FormData()
			files.forEach((f, idx)=>{
				formData.append('filename', files[idx])
			})			
			this.props.callbacks.dropFile(f.id, formData)
		}
	}

	removeFile(){
		// - only for fields of type image or document
		const f = this.props.model
		if(this.props.callbacks.dropFile){
			this.props.callbacks.dropFile(f.id, null)
		}
	}

}

Field.propTypes = {
	model: PropTypes.object.isRequired,
	callbacks: PropTypes.object,
	data: PropTypes.any,  // object or atomic values depending on field type
	value: PropTypes.any, // field value
	label: PropTypes.string, //override label in model
	readOnly: PropTypes.bool, //override label in model
}