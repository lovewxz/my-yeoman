require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
let imageDatas = require('../data/imageDatas.json')

function genImageURL(imageDatasArr){
	for (let i=0;i<imageDatasArr.length;i++){
		imageDatasArr[i].imgURL = '../images/'+imageDatasArr[i].fileName
	}
	return imageDatasArr
}

imageDatas = genImageURL(imageDatas)

/* 
 *获取两个边界之间的取值范围
*/
function getRangeRandom(low,high){
	return Math.floor(Math.random() * (high-low) + low)
}
/*
 *获取30°旋转的随机值
*/

function get30DegRandom(){
	 return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30)
}

class ImgFigure extends React.Component {
	constructor(props){
		super(props)

		this._handleClick = this._handleClick.bind(this)
	}
	/*
	 *imgFigure点击函数
	 */
	_handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.isInverse()
		}else{
			this.props.center()
		}
		
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		let styleObj = {}
		//如果props属性中指定了这张图的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos
		}
		if(this.props.arrange.rotate){
			['Ms','O','Webkit','','Moz'].forEach((value)=>{
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
			})
		}
		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		let imgFigureClassName = 'img-figure'
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this._handleClick}>
				<img src={this.props.data.imgURL} alt={this.props.data.title}/>	
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className='img-back' onClick={this._handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>			
		)
	}
}

class ControllerUnit extends React.Component{
	constructor(props){
		super(props)
		this._handleClick = this._handleClick.bind(this)
	}
	_handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.isInverse()
		}else{
			this.props.isCenter()
		}
		e.preventDefault()
		e.stopPropagation()
	}
	render(){
		let controllerUnitClassName = 'controller-unit'
		if(this.props.arrange.isCenter){
			controllerUnitClassName += ' is-center'
			if(this.props.arrange.isInverse){
				controllerUnitClassName += ' is-inverse'
			}
		}		
		return(
			<span className={controllerUnitClassName} onClick={this._handleClick}>
			</span>
		)
	}
}


class AppComponent extends React.Component {
  constructor(props){
	super(props)
	this.Constant = {
		centerPos:{
			left: 0,
			right: 0,
		},
		hPosRange:{  //左侧右侧的取值范围
			leftSecX: [0,0],
			rightSecX: [0,0],
			y: [0,0]
		},
		vPosRange:{   //上侧的取值范围
			x:[0,0],
			topY:[0,0]
		}
	}
	this.state = {
		imgsArrangeArr: [
			// {
			// 	pos: {
			// 		left: 0,
			// 		top: 0
			// 	},
			//  rotate: 0,
			//  isInverse: false, 图片正反面
			//  isCenter: false
			// }
		]
	}
	this._rearrange = this._rearrange.bind(this)
	this._inverse = this._inverse.bind(this)
  }
  /* 图片翻转
   * @param index 需要翻转的图片所在的索引位置
   * @return {Function} 这是一个闭包函数
   *
  */
  _inverse(index){
  	return ()=>{
  		let imgsArrangeArr = this.state.imgsArrangeArr
  		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
  		this.setState({
  			imgsArrangeArr:imgsArrangeArr
  		})
  	}
  }
  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布在哪个图片
   */
  _rearrange(centerIndex){
  	let imgsArrangeArr = this.state.imgsArrangeArr,
  		Constant = this.Constant,
  		centerPos = Constant.centerPos,
  		hPosRange = Constant.hPosRange,
  		vPosRange = Constant.vPosRange,
  		hPosRangeLeftSecX = hPosRange.leftSecX,
  		hPosRangeRightSecX = hPosRange.rightSecX,
  		hPosRangeY = hPosRange.y,
  		vPosRangeTopY = vPosRange.topY,
  		vPosRangeX = vPosRange.x,

  		imgsArrangeTopArr = [], //定义上侧的状态
  		topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
  		topImgSpliceIndex = 0, 
  		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1)

  		//首先居中centerIndex的图片
  		imgsArrangeCenterArr[0]={
  			pos: centerPos,
  			rotate: 0,
  			isCenter: true
  		}

  		//取出要布局上侧的图片的状态信息
  		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum)) //取出图片的取值范围
  		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum)

  		//布局位于上侧的图片
  		imgsArrangeTopArr.forEach((value,index)=>{
  			imgsArrangeTopArr[index] = {
  				pos:{
  					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
  					left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]) 
  				},
  				rotate: get30DegRandom(),
  				isCenter: false
  				  
  			}
  		})

  		//布局左右两侧图片
  		for(let i = 0,j = imgsArrangeArr.length,k = j/2;i < j;i++){
  			var hPosRangeLORX = null
  			//前半部分布局左边
  			if(i<k){
  				hPosRangeLORX = hPosRangeLeftSecX
  			}else{
  				hPosRangeLORX = hPosRangeRightSecX
  			}
  			imgsArrangeArr[i] = {
  				pos:{
  					top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
  					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
  				},
  				rotate: get30DegRandom(),
  				isCenter: false
  			}
  		}

  		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
  			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
  		}

  		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])

  		this.setState({
  			imgsArrangeArr: imgsArrangeArr
  		})
  }
  //组件加载完成，计算图片所在位置的范围
  componentDidMount(){
  	//定义舞台的大小
  	let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
  		stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
  		halfStageW = Math.floor(stageW / 2),
  		halfStageH = Math.floor(stageH / 2)
 	//拿到一个imgFigure的大小
 	let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
 		imgW = imgFigureDom.scrollWidth,
 		imgH = imgFigureDom.scrollHeight,
 		halfImgW = Math.floor(imgW / 2),
 		halfImgH = Math.floor(imgH / 2)

 	//计算中心图片所在的位置	
 	this.Constant.centerPos = {
 		left: halfStageW - halfImgW,
 		top: halfStageH - halfImgH
 	}

 	//计算图片在左侧，右侧的位置
 	this.Constant.hPosRange.leftSecX[0] = -halfImgW
 	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
 	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
 	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
 	this.Constant.hPosRange.y[0] = -halfImgH
 	this.Constant.hPosRange.y[1] = stageH - halfImgH

 	//计算图片在上侧的位置
 	this.Constant.vPosRange.x[0] = halfStageW - imgW
 	this.Constant.vPosRange.x[1] = halfStageW
 	this.Constant.vPosRange.topY[0] = -halfImgH
 	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3

 	this._rearrange(0)
  }
  _center(index){
  	return ()=>{
  		this._rearrange(index)
  	}
  }
  render() {
  	let imgFigures = [],
  		controllerUnits=[]
	imageDatas.forEach((value,index)=>{
	  if(!this.state.imgsArrangeArr[index]){
	  	this.state.imgsArrangeArr[index] = {
	  		pos:{
	  			left: 0,
	  			top: 0
	  		},
	  		rotate: 0,
	  		isInverse: false,
	  		isCenter: false
	  	}
	  }
	  imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]} isInverse = {this._inverse(index)} center = {this._center(index)}/>)
	  controllerUnits.push(<ControllerUnit key={index} arrange = {this.state.imgsArrangeArr[index]} isInverse={this._inverse(index)} isCenter={this._center(index)}/>)
	})
	//用ref索引stage的DOM节点，用this.refs获取这个DOM节点
    return (
    	<section className="stage" ref="stage">
  	  		<section className="img-sec">
  	  			{imgFigures}
    		</section>
    		<nav className="controller-nav">
    			{controllerUnits}
    		</nav>
    	</section>
    );
  }
}



export default AppComponent;
