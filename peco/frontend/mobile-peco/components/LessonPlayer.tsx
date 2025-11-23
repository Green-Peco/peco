import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// If using tailwind-rn, import it here
// import tw from 'tailwind-rn';

// Sample props structure for lesson
// lesson = {
//   type: 'article' | 'video' | 'quiz',
//   title: string,
//   content: string,
//   mediaUrl?: string,
//   questions?: [{
//     question: string,
//     options: [{ id: number, text: string, isCorrect: boolean }]
//   }]
//   xpReward: number
// }

const LessonPlayer = ({ lesson, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Progress bar calculation
  const totalSlides = lesson.type === 'quiz' ? lesson.questions.length : 1;
  const progress = ((currentIndex + 1) / totalSlides) * 100;

  // Handle option selection
  const handleOptionSelect = (questionIdx, optionIdx) => {
    setSelectedOptions({ ...selectedOptions, [questionIdx]: optionIdx });
  };

  // Check answer and move to next
  const handleCheck = () => {
    if (lesson.type === 'quiz') {
      const question = lesson.questions[currentIndex];
      const selected = selectedOptions[currentIndex];
      const isCorrect = question.options[selected]?.isCorrect;
      if (isCorrect) setScore(score + 1);
    }
    if (currentIndex + 1 < totalSlides) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
      if (onComplete) onComplete(score, lesson.xpReward);
    }
  };

  // Render content based on lesson type
  let content;
  if (lesson.type === 'article') {
    content = (
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{lesson.title}</Text>
        {lesson.mediaUrl && (
          <Image source={{ uri: lesson.mediaUrl }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }} />
        )}
        <Text style={{ fontSize: 16 }}>{lesson.content}</Text>
      </ScrollView>
    );
  } else if (lesson.type === 'quiz') {
    const question = lesson.questions[currentIndex];
    content = (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{question.question}</Text>
        {question.options.map((opt, idx) => {
          const selected = selectedOptions[currentIndex] === idx;
          let bgColor = '#eee';
          if (selected) bgColor = opt.isCorrect ? '#22c55e' : '#ef4444';
          return (
            <TouchableOpacity
              key={idx}
              style={{ backgroundColor: bgColor, padding: 12, borderRadius: 8, marginBottom: 8 }}
              onPress={() => handleOptionSelect(currentIndex, idx)}
            >
              <Text style={{ fontSize: 16 }}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={{ backgroundColor: '#22c55e', padding: 12, borderRadius: 8, marginTop: 16 }}
          onPress={handleCheck}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Check</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (lesson.type === 'video') {
    content = (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{lesson.title}</Text>
        {/* Video player placeholder */}
        <View style={{ backgroundColor: '#222', height: 200, borderRadius: 12, marginBottom: 12, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Video Placeholder</Text>
        </View>
        <Text style={{ fontSize: 16 }}>{lesson.content}</Text>
      </View>
    );
  }

  // Completion screen
  if (showResult) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 12 }}>Lesson Complete!</Text>
        <Text style={{ fontSize: 20, color: '#22c55e', marginBottom: 8 }}>+{lesson.xpReward} XP</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>Score: {score} / {totalSlides}</Text>
        <TouchableOpacity style={{ backgroundColor: '#22c55e', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Back to Path</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Progress Bar */}
      <View style={{ height: 8, backgroundColor: '#eee', width: '100%' }}>
        <View style={{ height: 8, backgroundColor: '#22c55e', width: `${progress}%` }} />
      </View>
      {content}
    </View>
  );
};

export default LessonPlayer;
