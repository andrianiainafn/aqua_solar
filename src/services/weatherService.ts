
interface WeatherData {
    date: string;
    maxTemp: number;
    rainSum: number;
    weatherCode: number;
}

interface ForecastResult {
    today: WeatherData;
    tomorrow: WeatherData;
    week: WeatherData[];
}

export const WeatherService: any = {
    // Coordonnées par défaut (Antananarivo)
    LAT: -18.8792,
    LON: 47.5079,

    async getForecast(lat = WeatherService.LAT, lon = WeatherService.LON): Promise<ForecastResult> {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,precipitation_sum&timezone=auto`
            );
            const data = await response.json();

            const formatData = (index: number): WeatherData => ({
                date: data.daily.time[index],
                maxTemp: data.daily.temperature_2m_max[index],
                rainSum: data.daily.precipitation_sum[index],
                weatherCode: data.daily.weather_code[index],
            });

            const week = data.daily.time.map((_: any, index: number) => formatData(index));

            return {
                today: week[0],
                tomorrow: week[1],
                week: week,
            };
        } catch (error) {
            console.error("WeatherService Error:", error);
            throw error;
        }
    },

    getRecommendation(type: 'general' | 'energy' | 'water', today: WeatherData, tomorrow: WeatherData): string {
        const isRainyTomorrow = tomorrow.rainSum > 5;
        const isSunnyToday = today.maxTemp > 25 && today.rainSum < 2;
        const isRainyToday = today.rainSum > 5;

        if (type === 'energy') {
            if (isRainyTomorrow) return "Forte probabilité de pluie demain. Stockez un maximum d'énergie aujourd'hui (batteries à 100%) pour compenser la baisse de production solaire à venir.";
            if (isSunnyToday) return "Ensoleillement optimal aujourd'hui ! C'est le moment idéal pour faire tourner les équipements énergivores ou vendre le surplus.";
            if (isRainyToday) return "Production solaire limitée par la météo. Le système priorise les charges critiques et minimise la consommation sur batterie.";
            return "Conditions stables. Maintenez une gestion standard de votre consommation énergétique.";
        }

        if (type === 'water') {
            if (isRainyTomorrow) return "Pluie prévue demain ! Préparez les réservoirs de collecte d'eau de pluie et réduisez le pompage pour économiser l'énergie.";
            if (isRainyToday) return "Il pleut. La collecte d'eau de pluie est active. Le pompage est suspendu pour éviter le gaspillage d'énergie.";
            if (isSunnyToday) return "Temps sec et chaud. L'évaporation est forte, surveillez les niveaux des réservoirs et irriguez de préférence le soir.";
            return "Niveaux d'eau stables. Aucune action particulière requise pour le moment.";
        }

        // General (AIPredictions)
        if (isRainyTomorrow) return "Forte probabilité de pluie demain. Stockez un maximum d'énergie aujourd'hui pour compenser la baisse de production à venir.";
        if (isSunnyToday) return "Conditions solaires optimales aujourd'hui. Profitez-en pour faire tourner les équipements énergivores.";
        if (isRainyToday) return "Production solaire faible due à la pluie. Le système basculera automatiquement sur les batteries si nécessaire.";
        return "Conditions stables. Maintenez une consommation normale.";
    },

    getWeatherLabel(code: number): string {
        if (code <= 3) return "Ensoleillé / Nuageux";
        if (code <= 67) return "Pluvieux";
        if (code <= 99) return "Orageux";
        return "Variable";
    },

    getWeatherIconLabel(code: number): string {
        if (code <= 3) return "☀️";
        if (code <= 67) return "🌧️";
        if (code <= 99) return "⛈️";
        return "⛅";
    }
};
