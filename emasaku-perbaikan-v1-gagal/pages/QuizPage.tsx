import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    QuestionMarkCircleIcon as QuestionMarkCircleIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid, 
    XCircleIcon as XCircleIconSolid 
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const QuestionMarkCircleIcon = (QuestionMarkCircleIconSolid as any).default || QuestionMarkCircleIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XCircleIcon = (XCircleIconSolid as any).default || XCircleIconSolid;


interface QuizPageProps {
  setActivePage: (page: string) => void;
}

const quizQuestions = [
  {
    question: "Dalam investasi, apa yang dimaksud dengan 'diversifikasi'?",
    options: ["Menaruh semua dana di satu aset", "Menyebar dana ke berbagai jenis aset", "Hanya berinvestasi pada saham teknologi", "Menjual aset saat harga turun"],
    answer: "Menyebar dana ke berbagai jenis aset",
    explanation: "Diversifikasi adalah strategi mengurangi risiko dengan berinvestasi pada berbagai aset. Jika satu aset berkinerja buruk, kerugian dapat ditutupi oleh keuntungan dari aset lain."
  },
  {
    question: "Mana di antara berikut yang merupakan contoh 'liabilitas' (utang)?",
    options: ["Uang tunai di rekening tabungan", "Rumah yang dimiliki penuh", "Cicilan mobil yang belum lunas", "Investasi reksa dana"],
    answer: "Cicilan mobil yang belum lunas",
    explanation: "Liabilitas adalah kewajiban finansial atau utang yang harus dibayar, seperti cicilan, pinjaman, atau tagihan kartu kredit."
  },
  {
    question: "Apa fungsi utama dari dana darurat?",
    options: ["Untuk berlibur mewah", "Untuk membeli gadget terbaru", "Untuk investasi jangka panjang", "Untuk menutupi pengeluaran tak terduga"],
    answer: "Untuk menutupi pengeluaran tak terduga",
    explanation: "Dana darurat adalah simpanan yang mudah diakses untuk keperluan mendesak, seperti biaya medis atau kehilangan pekerjaan, tanpa harus mengganggu investasi."
  },
  {
    question: "Istilah 'inflasi' dalam ekonomi berarti...",
    options: ["Penurunan harga barang secara umum", "Kenaikan nilai mata uang", "Kenaikan harga barang dan jasa secara umum", "Stagnasi ekonomi"],
    answer: "Kenaikan harga barang dan jasa secara umum",
    explanation: "Inflasi menyebabkan daya beli uang menurun. Dengan jumlah uang yang sama, Anda mendapatkan lebih sedikit barang atau jasa dibandingkan sebelumnya."
  },
  {
    question: "Apa keuntungan utama menabung di produk seperti Deposito dibandingkan tabungan biasa?",
    options: ["Bisa diambil kapan saja tanpa penalti", "Suku bunga yang umumnya lebih tinggi", "Tidak ada setoran minimum", "Tidak ada risiko sama sekali"],
    answer: "Suku bunga yang umumnya lebih tinggi",
    explanation: "Deposito menawarkan suku bunga yang lebih tinggi karena dana dikunci untuk jangka waktu tertentu, memberikan kepastian bagi bank."
  }
];

const QuizPage: React.FC<QuizPageProps> = ({ setActivePage }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === currentQuestion.answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setIsAnswered(false);
    };

    if (showResult) {
        return (
            <div className="max-w-2xl mx-auto animate-fade-in text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Kembali ke Dasbor"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Quiz Selesai!</h2>
                <p className="text-5xl font-bold text-primary dark:text-gold-light my-4">
                    {score}/{quizQuestions.length}
                </p>
                <p className="text-lg text-text-secondary dark:text-dark-text-secondary">Anda menjawab {score} dari {quizQuestions.length} pertanyaan dengan benar.</p>
                <button
                    onClick={handleRestart}
                    className="mt-8 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-3 px-8 rounded-lg transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Dashboard')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Dasbor"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <QuestionMarkCircleIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Quiz Finansial
          </h1>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">Pertanyaan {currentQuestionIndex + 1} dari {quizQuestions.length}</h3>
            <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
            </div>
        </div>
        
        <p className="text-xl font-semibold my-6 text-text-primary dark:text-dark-text-primary">{currentQuestion.question}</p>

        <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isTheCorrectAnswer = currentQuestion.answer === option;
                
                let buttonClass = "w-full text-left p-4 border-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed";
                if (isAnswered) {
                    if (isTheCorrectAnswer) {
                        buttonClass += " bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
                    } else if (isSelected) {
                        buttonClass += " bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                    } else {
                        buttonClass += " border-slate-300 dark:border-slate-600 text-text-secondary dark:text-dark-text-secondary";
                    }
                } else {
                    buttonClass += " border-slate-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-400";
                }

                return (
                    <button key={index} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={isAnswered}>
                        {option}
                    </button>
                );
            })}
        </div>

        {isAnswered && (
            <div className={`mt-6 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2">
                    {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-500"/> : <XCircleIcon className="w-6 h-6 text-red-500"/>}
                    <h4 className="font-bold text-lg">{isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}</h4>
                </div>
                <p className="text-sm mt-2 text-text-secondary dark:text-dark-text-secondary">{currentQuestion.explanation}</p>
            </div>
        )}

        {isAnswered && (
            <button 
                onClick={handleNext} 
                className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-3 px-4 rounded-lg transition-colors"
            >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Lanjut' : 'Lihat Hasil'}
            </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;