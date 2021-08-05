import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GridScreen } from './views/Grid';
import { Row, Col, Button } from "react-bootstrap";

const App = () => {
  const listNumber: number[] = [15, 14, 1, 6, 9, 11, 4, 12, 0, 10, 7, 3, 13, 8, 5, 2]
  const [selectedList, setSetSelectedList] = useState<number[]>([15, 14, 1, 6, 9, 11, 4, 12, 0, 10, 7, 3, 13, 8, 5, 2])
  const [drawNumbers, setDrawNumbers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [moves, setMoves] = useState<string>("")
  const [path, setPath] = useState<any>([])

  /*const MatrixToArray = (matrix: number[][]): number[] => {
    let newArr: number[] = []
    for (var i = 0; i < matrix.length; i++) {
      const removeIndex: any = matrix[i].indexOf(0)
      if (removeIndex !== -1) {
        matrix[i].splice(removeIndex, 1);
      }
      newArr = newArr.concat(matrix[i]);
    }
    return newArr
  }*/

  useEffect(() => {
    setDrawNumbers(drawMatrix(selectedList))
  }, []);

  const shuffle = () => {
    const shuffledArray = selectedList.sort((a, b) => 0.5 - Math.random());
    setDrawNumbers(drawMatrix(shuffledArray))
    setSetSelectedList(shuffledArray);
  }
  const drawMatrix = (listNumbers: number[]) => {
    const layout: any[] = [];
    for (let index = 0; index < 16; index += 4) {
      layout.push(
        <Row key={"father" + index}>
          <Col md={3} style={{ paddingLeft: 10, paddingRight: 10 }} key={"" + index}>
            <div style={{ backgroundColor: listNumbers[index] !== 0 ? "#ffb029" : "#c3c3c3" }}>
              <h3 style={{ textAlign: 'center' }}>{listNumbers[index] !== 0 ? listNumbers[index] : ""}</h3>
            </div>
          </Col>
          <Col md={3} style={{ paddingLeft: 10, paddingRight: 10 }} key={"" + index}>
            <div style={{ backgroundColor: listNumbers[index + 1] !== 0 ? "#ffb029" : "#c3c3c3" }}>
              <h3 style={{ textAlign: 'center' }}>{listNumbers[index + 1] !== 0 ? listNumbers[index + 1] : ""}</h3>
            </div>
          </Col>
          <Col md={3} style={{ paddingLeft: 10, paddingRight: 10 }} key={"" + index}>
            <div style={{ backgroundColor: listNumbers[index + 2] !== 0 ? "#ffb029" : "#c3c3c3" }}>
              <h3 style={{ textAlign: 'center' }}>{listNumbers[index + 2] !== 0 ? listNumbers[index + 2] : ""}</h3>
            </div>
          </Col>
          <Col md={3} style={{ paddingLeft: 10, paddingRight: 10 }} key={"" + index}>
            <div style={{ backgroundColor: listNumbers[index + 3] !== 0 ? "#ffb029" : "#c3c3c3", }}>
              <h3 style={{ textAlign: 'center' }}>{listNumbers[index + 3] !== 0 ? listNumbers[index + 3] : ""}</h3>
            </div>

          </Col>
        </Row>
      )
    }
    return layout
  }

  const solve = () => {
    setLoading(true)
    setMoves("")
    fetch("http://127.0.0.1:5000/solve", {
      method: 'POST',
      body: JSON.stringify({ "data": selectedList }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then(response => response.json())
      .then(json => {
        setMoves(json.moves);
        const drawResults: any[] = []
        let count = 0
        json.path.forEach((element: number[]) => {
          const newMatrix: any = drawMatrix(element)
          const key: string = "result" + count;
          drawResults.push(
            <Col md={4} key={key} style={{ padding: 5 }}>
              <div style={{ backgroundColor: "black", padding: 10 }}>
                {newMatrix}
              </div>
            </Col>
          )
          count += 1;
        });

        setPath(drawResults);
        setLoading(false)
      })
      .catch(err => console.log(err));
  }
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>15 Puzzle</h1>
      <Row>
        <Col className="justify-content-md-center">
          <h3 style={{ textAlign: 'center' }}>Entrada manual</h3>
          <GridScreen
            listNumbers={listNumber}
            setArray={(list: number[]) => {
              setSetSelectedList(list)
              setDrawNumbers(drawMatrix(list))
            }}
          />
        </Col>
        <Col style={{backgroundColor:"#FAFAFA"}}>
          <h3 style={{ textAlign: 'center' }}>Datos Cargados</h3>
          <div style={{ backgroundColor: 'black', padding: 15, marginBottom: 10 }}>
            {drawNumbers}
          </div>
          <Row style={{ marginLeft: 20 }}>
            <Col>
              <Button onClick={shuffle} variant="dark">Random</Button>
            </Col>
            <Col>
              <Button onClick={solve} variant="dark">Resolver problema</Button>
            </Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </Col>
      </Row>
      {moves === "" && loading && <div>
        <h3>Resolviendo...</h3>
      </div>}
      {moves !== "" && <div>
        <h3>Movimientos: {moves}</h3>
        <Row>
          {path}
        </Row>
      </div>}
    </div>

  )
}

export default App;
