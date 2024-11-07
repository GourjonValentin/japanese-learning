

export function parseTranslation(jishoResponse) {
    const data = jishoResponse.data;
    let idGen = 0;
    return data.map(word => {
        const id = idGen++;
        const japanese = word.japanese.map(jp => { return { id: idGen++, word: jp.word, reading: jp.reading } })
        const english = word.senses.map(sense => {
            return {
                id: idGen++, english_definitions: sense.english_definitions.map(
                    def => { return { id: idGen++, def: def } }
                )
            }
        });
        return { id, japanese, english };
    });
}

export default parseTranslation;