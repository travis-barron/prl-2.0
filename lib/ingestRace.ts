import { supabase } from "./supabase"

async function GetPointsSystem() {

    const {data: seasonData, error } = await supabase
        .from('seasons')
        .select(`points_system_id`)
        .eq('active', true)

    if (!seasonData || seasonData.length == 0)
    {
        console.error('Invalid season entered. No points system to retrieve')
        return null;
    }

    const systemIds = seasonData[0].points_system_id

    const { data: positions } = await supabase
        .from("points_positions")
        .select("position, points")
        .eq("system_id", systemIds)

    const { data: bonuses } = await supabase
        .from("points_bonus")
        .select("type, points")
        .eq("system_id", systemIds)

    if (!positions || !bonuses) {
        console.error('Invalid system ID. No points system loaded.')
        return null;
    }

    const system = {
        positions: Object.fromEntries(
            positions.map(p => [p.position, p.points])
        ),
        bonus: Object.fromEntries(
            bonuses.map(b => [b.type, b.points])
        )
    }

    console.log(system)
    return system;
}

export async function ingestRace(race: any, seasonId: number) {

    const { data: existingRace } = await supabase
        .from("races")
        .select("id")
        .eq("season_id", seasonId)
        .eq("track", race.track)
        .eq("date", race.date)
        .maybeSingle()

    if (existingRace) {
        throw new Error("Race already exists in database.")
    }

    // ---------------------
    // Determine next race number
    // ---------------------

    const { data: lastRace } = await supabase
        .from("races")
        .select("race_number")
        .eq("season_id", seasonId)
        .order("race_number", { ascending: false })
        .limit(1)
        .maybeSingle()

    const nextRaceNumber = (lastRace?.race_number ?? 0) + 1

    // ---------------------
    // Create race
    // ---------------------

    const { data: dbRace, error: raceError } = await supabase
        .from("races")
        .insert({
            season_id: seasonId,
            race_number: nextRaceNumber,
            track: race.track,
            date: race.date,
            cautions: race.cautions,
            lead_changes: race.leadChanges,
            ai_strength: race.aiStrength
        })
        .select()
        .single()

    if (raceError) {

        if (raceError.code === "23505") {
            throw new Error("This race has already been uploaded.")
        }

        throw raceError
    }

    for (const result of race.race) {

        // ---------------------
        // 1. Find or create driver
        // ---------------------

        let { data: driver } = await supabase
            .from("drivers")
            .select("*")
            .eq("name", result.driver)
            .maybeSingle()

        if (!driver) {
            const { data, error } = await supabase
                .from("drivers")
                .insert({ name: result.driver })
                .select()
                .single()

            if (error) throw error

            driver = data
        }

        // ---------------------
        // 2. Find or create season entry
        // ---------------------

        let { data: seasonEntry } = await supabase
            .from("season_entries")
            .select("*")
            .eq("season_id", seasonId)
            .eq("driver_id", driver.id)
            .maybeSingle()

        if (!seasonEntry) {

            const { data, error } = await supabase
                .from("season_entries")
                .insert({
                    season_id: seasonId,
                    driver_id: driver.id,
                    car_number: result.carNumber
                })
                .select()
                .single()

            if (error) throw error

            seasonEntry = data
        }

        // ---------------------
        // 3. Insert race result
        // ---------------------
        const pointsSystem = await GetPointsSystem()
        const { error: resultError } = await supabase
            .from("race_results")
            .insert({
                race_id: dbRace.id,
                season_entry_id: seasonEntry.id,

                finish: result.finish,
                start_pos: result.start,
                laps_completed: result.lapsCompleted,
                laps_led: result.lapsLed,
                status: result.status,
                points: pointsSystem?.positions[result.finish]
            })

        if (resultError) throw resultError
    }

    return dbRace
}