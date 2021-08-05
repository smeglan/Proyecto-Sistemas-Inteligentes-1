from solver import IDAStar, slide_neighbours, slide_solved_state, slide_wd
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/solve", methods=["POST"])
def resolve():
    content = request.get_json()
    print(content)
    tupla = [tuple(content["data"]),]
    tests = tupla
    solved_state = slide_solved_state(4)
    neighbours = slide_neighbours(4)
    is_goal = lambda p: p == solved_state
 
    slide_solver = IDAStar(slide_wd(4, solved_state), neighbours)
    
    resultMoves = "",
    paths= ""
    for p in tests:
        path, moves, cost, num_eval = slide_solver.solve(p, is_goal, 80)
        paths = path
        resultMoves = ", ".join({-1: "Izquierda", 1: "Derecha", -4: "Arriba", 4: "Abajo"}[move[1]] for move in moves)
        print(resultMoves)
        print(cost, num_eval)
    results = {
        "moves":resultMoves,
        "path":paths
    }
    return results