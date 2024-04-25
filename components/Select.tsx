import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

type Coordenada = {
    lat: string,
    lon: string
}

type Pais = {
    country: string,
    region: string
}

type Data = {
    [key: string]: Pais
}

type WeatherData = {
    time: string,
    temperature_2m: number,
    relative_humidity_2m: number,
    precipitation: number,
    rain: number,
    temperature_2mUnits: string,
    relative_humidity_2mUnits: string,
    precipitationUnits: string,
    rainUnits: string
}

export const Select: FunctionComponent = () => {
    const [pais, setPais] = useState<string>("Spain");
    const [ciudad, setCiudad] = useState<string>("Madrid");
    const [coordenada, setCoordenada] = useState<Coordenada>({lat: "40.4165", lon: "-3.7026"}); //Coordenadas por defecto de Madrid
    const [weatherData, setWeatherData] = useState<WeatherData>();

    const [checkTemperatura, setCheckTemperatura] = useState<boolean>(false);
    const [checkHumedad, setCheckHumedad] = useState<boolean>(false);
    const [checkPrecipitacion, setCheckPrecipitacion] = useState<boolean>(false);
    const [checkLluvia, setCheckLluvia] = useState<boolean>(false);

    const [paises, setPaises] = useState<Pais[]>([]);
    const [ciudades, setCiudades] = useState<string[]>([]);

    useEffect(() => {
        const handlerPais = async () => {
            const respuesta = await fetch(`https://api.first.org/data/v1/countries/?region=europe`);
            const data = await respuesta.json();

            const paises:Pais[] = [];

            for (const key in data.data) {
                paises.push(data.data[key]);
            }

            setPaises(paises);
        }
        handlerPais();
    }, [])

    useEffect(() => {
        const handlerCiudad = async () => {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({country: pais})
            });

            const data = await response.json();

            setCiudades(data.data);
        }
        
        handlerCiudad();
    }, [pais]);

    useEffect(() => {

        const handlerCoordenada = async () => {
            const API_KEY = "D1oDDpTXCSO/1HFfUumduw==0cuaUdZ0oYiV28rl";
    
            const urlCiudad = `https://api.api-ninjas.com/v1/city?name=${ciudad}`;
    
            const result = await fetch(urlCiudad, { 
                headers: {
                    "X-Api-Key": API_KEY
                }
            });

            const data = await result.json();

            setCoordenada({lat: data[0].latitude, lon: data[0].longitude});
        }
        handlerCoordenada();
    }, [ciudad]);

    useEffect(() => {
        const handlerWeather = async() => {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordenada.lat}&longitude=${coordenada.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain&hourly=&forecast_days=1`)
        
            const data = await response.json();

            const weatherData:WeatherData = {
                time: data.current.time,
                temperature_2m: data.current.temperature_2m,
                relative_humidity_2m: data.current.relative_humidity_2m,
                precipitation: data.current.precipitation,
                rain: data.current.rain,
                temperature_2mUnits: data.current_units.temperature_2m,
                relative_humidity_2mUnits: data.current_units.relative_humidity_2m,
                precipitationUnits: data.current_units.precipitation,
                rainUnits: data.current_units.rain
            }

            setWeatherData(weatherData);
        }

        handlerWeather();
    }, [coordenada]);

    return(
        <div>
            <h2>Its raining men</h2>
            <select value={pais} onChange={(e) => setPais(e.currentTarget.value)}>
                {paises.map((pais) => {
                    return <option value={pais.country}>{pais.country}</option>
                })}
            </select>
            <select value={ciudad} onChange={(e) => setCiudad(e.currentTarget.value)}>
                {ciudades.map((ciudad) => {
                    return <option value={ciudad}>{ciudad}</option>
                })}
            </select>
            <label>Ver temperatura</label>
            <input type = "checkbox" checked = {checkTemperatura} onChange = {() => setCheckTemperatura(!checkTemperatura)}></input>
            <label>Ver humedad</label>
            <input type = "checkbox" checked = {checkHumedad} onChange = {() => setCheckHumedad(!checkHumedad)}></input>
            <label>Ver precipitacion</label>
            <input type = "checkbox" checked = {checkPrecipitacion} onChange = {() => setCheckPrecipitacion(!checkPrecipitacion)}></input>
            <label>Ver lluvia</label>
            <input type = "checkbox" checked = {checkLluvia} onChange = {() => setCheckLluvia(!checkLluvia)}></input>
            <div>
                {weatherData && checkTemperatura && <p>Temperatura: {weatherData.temperature_2m} {weatherData.temperature_2mUnits}</p>}
                {weatherData && checkHumedad && <p>Humedad: {weatherData.relative_humidity_2m} {weatherData.relative_humidity_2mUnits}</p>}
                {weatherData && checkPrecipitacion && <p>Precipitacion: {weatherData.precipitation} {weatherData.precipitationUnits}</p>}
                {weatherData && checkLluvia && <p>Lluvia: {weatherData.rain} {weatherData.rainUnits}</p>}
            </div>
        </div>
    )
}