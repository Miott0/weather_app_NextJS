'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";


interface CurrentDateInfo {
  diaSemana: string;
  data: string;
  hora: string;
}

function getCurrentDate(): CurrentDateInfo {
  const currentDate: Date = new Date();

  // Obter o nome do dia da semana
  const optionsDiaSemana: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const diaSemana: string = currentDate.toLocaleString("pt-BR", optionsDiaSemana);

  // Obter a data formatada
  const optionsData: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const data: string = currentDate.toLocaleString("pt-BR", optionsData);

  // Obter a hora formatada
  const optionsHora: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: false };
  const hora: string = currentDate.toLocaleString("pt-BR", optionsHora);

  return {
    diaSemana,
    data,
    hora,
  };
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

export default function Home(): JSX.Element {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('São Fidélis');

  async function fetchData(cityName: string): Promise<void> {
    try {
      const response = await fetch(
        `https://https://dev-miott-weatherapp.vercel.app/api/weather?address=${cityName}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData('São Fidélis');
  }, []);

  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <form
          className={styles.weatherLocation}
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
        >
          <input
            className={styles.input_field}
            placeholder="Enter city name"
            type="text"
            id="cityName"
            name="cityName"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className={styles.search_button} type="submit">
            Search
          </button>
        </form>
        {weatherData ? (
          <>
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                {weatherData?.weather[0]?.description === 'rain' ||
                weatherData?.weather[0]?.description === 'fog' ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy"></i>
                )}
              </div>
              <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>
                    {(weatherData?.main?.temp - 273.5).toFixed(2) +
                      String.fromCharCode(176)}
                  </span>
                </div>
                <div className={styles.weatherCondition}>
                  {weatherData?.weather[0]?.description?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className={styles.place}>{weatherData?.name}</div>
            <div className={styles.date}>{date.diaSemana}, {date.data}</div>
          </>
        ) : (
          <div className={styles.place}>Loading...</div>
        )}
      </article>
    </main>
  );
}
