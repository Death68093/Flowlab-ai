const supabaseUrl = 'https://pjpynjhybkqoixgbwxbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcHluamh5Ymtxb2l4Z2J3eGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDQ1NzgsImV4cCI6MjA0NjQ4MDU3OH0.bwq4Q_V5vtErIvCBj64Jtf0DNRbPod121w9so-_JwGU';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function submitCode() {
    try {
        const codeName = document.getElementById("codeName").value;
        const description = document.getElementById("codeDescription").value;
        const code = document.getElementById("codeContent").value;

        const { data, error } = await supabase
            .from('code')
            .insert([{ code_name: codeName, description, code }]);

        if (error) {
            console.error("Error inserting code:", error);
            document.getElementById("output").innerText = `Error: ${error.message}`;
        } else {
            document.getElementById("output").innerText = "Code added successfully!";
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        document.getElementById("output").innerText = `Unexpected error: ${err.message}`;
    }
}
