import { createWorker } from 'tesseract.js';

export const ocrService = {
  worker: null,
  async initWorker() {
    if (!this.worker) {
      this.worker = await createWorker({
        logger: m => {
          console.log(m);
        },
        langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast'
      });
      await this.worker.loadLanguage('fra');
      await this.worker.initialize('fra');
    }
    return this.worker;
  },  async analyzeImage(file) {
    try {
      console.log('Démarrage de l\'analyse OCR...');
      const worker = await this.initWorker();
      console.log('Worker initialisé');
      
      // Convertir le fichier en URL data
      const imageUrl = URL.createObjectURL(file);
      console.log('Image convertie en URL:', imageUrl);
      
      // Effectuer l'OCR      console.log('Début de la reconnaissance...');
      const { data } = await worker.recognize(imageUrl);
      console.log('Texte extrait:', data.text);
      
      // Libérer l'URL
      URL.revokeObjectURL(imageUrl);      // Analyser le texte pour extraire les informations pertinentes
      const description = this.extractDescription(data.text);
      const amount = this.extractAmount(data.text);
      const date = this.extractDate(data.text);

      return {
        description,
        amount,
        date
      };
    } catch (error) {
      console.warn('Erreur lors de l\'analyse OCR:', error);
      return {
        description: '',
        amount: ''
      };
    }
  },

  extractDescription(text) {
    // Diviser le texte en lignes
    const lines = text.split('\n');
    
    // Filtrer les lignes qui correspondent au format "Nom Prix"
    const items = lines.filter(line => {
      // Format: mot suivi d'un montant (ex: "Libero 87,55")
      const itemPattern = /^[A-Za-z]+\s+\d+[.,]\d{2}$/;
      return itemPattern.test(line.trim());
    });

    if (items.length > 0) {
      // Extraire le nom de l'item (tout avant le dernier espace)
      const firstItem = items[0].trim();
      const description = firstItem.substring(0, firstItem.lastIndexOf(' '));
      return description;
    }

    return '';
  },

  extractAmount(text) {
    const lines = text.split('\n');
    
    // Chercher spécifiquement la ligne "Total:"
    const totalLine = lines.find(line => 
      line.trim().toLowerCase().startsWith('total:')
    );

    if (totalLine) {
      // Extraire le montant après "Total:"
      const match = totalLine.match(/Total:\s*(\d+[.,]\d{2})/i);
      if (match) {
        return match[1].replace(',', '.');
      }
    }

    // Si pas de total trouvé, chercher tous les montants au format XX,XX ou XX.XX
    const amounts = text.match(/\d+[.,]\d{2}/g) || [];
    if (amounts.length > 0) {
      // Convertir en nombres et prendre le plus grand
      const numericAmounts = amounts.map(amount => 
        parseFloat(amount.replace(',', '.'))
      );
      return Math.max(...numericAmounts).toString();
    }

    return '';
  },

  extractDate(text) {
    const lines = text.split('\n');
    
    // Rechercher une ligne contenant "Date:" ou un format de date
    const dateLine = lines.find(line => 
      line.toLowerCase().includes('date:') || 
      line.match(/\d{2}[/.-]\d{2}[/.-]\d{4}/)
    );

    if (dateLine) {
      // Essayer d'extraire une date au format DD/MM/YYYY ou DD-MM-YYYY ou DD.MM.YYYY
      const dateMatch = dateLine.match(/(\d{2})[/.-](\d{2})[/.-](\d{4})/);
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        return `${day}/${month}/${year}`;
      }
    }

    return '';
  },

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
};
