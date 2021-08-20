export const ShipMassSize = (props) => {

    const shipList = props.shipList;
    const targetShip = props.targetShip;

    const unitSize = shipList[targetShip].size;

    const unitmass = (color) => {
        const tempDOM = [];
        for (let x = 0; x < unitSize[0]; x++) {
            tempDOM[x] = xLineDiv(color, x);
        }
        return tempDOM;
    }

    const xLineDiv = (color, x) => {
        const tempDOM = [];
        for (let y = 0; y < unitSize[1]; y++) {
            tempDOM[y] = yLineMass(color, x, y);
        }
        return (
            <div key={`${color}${x * 9999}`}>{tempDOM}</div>
        )
    }

    const yLineMass = (color, x, y) => {
        return (
            <div key={`${color}${x * 10 + y}`} style={{ backgroundColor: color }}>O</div>
        );
    }



    return (
        <div className='ShipMassSize'>
            {unitmass(shipList[targetShip].color)}
        </div>
    );

}