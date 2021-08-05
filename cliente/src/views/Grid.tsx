import React, { PureComponent } from "react";
import { IGrid } from "../interfaces/grid.interface";
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button } from "react-bootstrap";

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridProps = {
    listNumbers: number[]
    setArray: (listNumbers: number[]) => void
}

type GridStates = {
    layout: IGrid[]
    resultList: number[]
    drawNumbers: number[]
}

export class GridScreen extends PureComponent<GridProps, GridStates>{

    constructor(props: GridProps) {
        super(props);
        this.state = {
            layout: [],
            drawNumbers: [],
            resultList: []
        }
    }
    buildLayout = (): IGrid[] => {
        const layout: IGrid[] = [];
        for (let i = 0; i < 16; i++) {
            if (i / 4 < 1) {
                layout.push(
                    {
                        i: "" + i,
                        x: i,
                        y: 0,
                        w: 1,
                        h: 2
                    }
                );
            } else {
                layout.push(
                    {
                        i: "" + i,
                        x: i - (4 * Math.floor(i / 4)),
                        y: Math.floor(i / 4),
                        w: 1,
                        h: 2
                    }
                );
            }
        }
        console.log(layout)
        return layout
    }
    componentDidMount = () => {
        this.setState({ layout: this.buildLayout(), drawNumbers: this.props.listNumbers, resultList: this.props.listNumbers });
    }
    onDrop = (item: IGrid[]) => {
        const results: number[] = [];
        const items: any = {};
        item.forEach(element => {
            items[(element.y * 10) + element.x] = parseInt(element.i)
        });
        Object.keys(items).forEach(key => {
            results.push(this.props.listNumbers[items[key]])
        })
        this.setState({ resultList: results });
    }
    render() {
        return (
            <>
                <ResponsiveGridLayout
                    isDraggable={true}
                    isResizable={false}
                    style={{ backgroundColor: '#ffe1ad' }}
                    layouts={{ lg: this.state.layout, md: this.state.layout, sm: this.state.layout, xs: this.state.layout, xxs: this.state.layout }}
                    breakpoints={{ lg: 400, md: 400, sm: 400, xs: 400, xxs: 0 }}
                    cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
                    rowHeight={30}
                    onDragStart={() => console.log("se movio")}
                    onDragStop={this.onDrop}
                >
                    {this.state.drawNumbers.map((value, index) => <div style={{ backgroundColor: value !== 0 ? "#ffb029" : "#c3c3c3", paddingTop: 10 }} key={"" + index}><h3 style={{ textAlign: 'center' }}>{value !== 0 ? value : ""}</h3></div>)}
                </ResponsiveGridLayout>
                <Button style={{ margin: 20 }} onClick={(e) => { console.log(this.state.resultList); this.props.setArray(this.state.resultList) }} variant="dark">Asignar</Button>
            </>
        )
    }
}
