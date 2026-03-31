"""
AI Image Detector using basic image processing
Detects AI-generated vs authentic images without heavy ML frameworks
"""

import sys
import json
import base64
import io
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

class SimpleAIDetector:
    def __init__(self):
        self.confidence_threshold = 0.5
        
    def analyze_image(self, image_data):
        try:
            img = self._load_image(image_data)
            if img is None:
                return self._error_result("Failed to load image")
            
            results = {}
            results['ela_analysis'] = self._ela_analysis(img)
            results['noise_analysis'] = self._noise_analysis(img)
            results['compression_analysis'] = self._compression_analysis(img)
            results['color_analysis'] = self._color_analysis(img)
            results['texture_analysis'] = self._texture_analysis(img)
            
            verdict = self._compute_verdict(results)
            
            return {
                'success': True,
                'isAI': verdict['isAI'],
                'confidence': verdict['confidence'],
                'authenticity_score': verdict['authenticity_score'],
                'ai_probability': verdict['ai_probability'],
                'summary': verdict['summary'],
                'indicators': verdict['indicators']
            }
            
        except Exception as e:
            return self._error_result(str(e))
    
    def _load_image(self, image_data):
        try:
            if isinstance(image_data, str):
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                img_bytes = base64.b64decode(image_data)
            else:
                img_bytes = image_data
            
            img = Image.open(io.BytesIO(img_bytes))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            return img
        except:
            return None
    
    def _ela_analysis(self, img):
        result = {'score': 0.5, 'indicators': [], 'verdict': 'uncertain'}
        
        try:
            w, h = img.size
            if w < 100 or h < 100:
                return {'score': 0.5, 'indicators': ['Image too small'], 'verdict': 'uncertain'}
            
            scale = 10
            compressed = img.resize((w // scale, h // scale), Image.LANCZOS)
            reconstructed = compressed.resize((w, h), Image.LANCZOS)
            
            diff = np.array(img, dtype=np.float32) - np.array(reconstructed, dtype=np.float32)
            ela_value = np.mean(np.abs(diff))
            
            if ela_value < 5:
                result['score'] = 0.7
                result['indicators'].append('Very uniform pixels (possible AI)')
            elif ela_value < 15:
                result['score'] = 0.4
                result['indicators'].append('Normal compression patterns')
            else:
                result['score'] = 0.2
                result['indicators'].append('High pixel variation (likely authentic)')
            
            result['ela_value'] = float(ela_value)
            result['verdict'] = 'ai_suspicious' if result['score'] > 0.5 else 'authentic'
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def _noise_analysis(self, img):
        result = {'score': 0.5, 'indicators': [], 'verdict': 'uncertain'}
        
        try:
            gray = img.convert('L')
            img_array = np.array(gray, dtype=np.float32)
            
            noise = img_array - np.median(img_array)
            noise_std = np.std(noise)
            
            high_freq = np.abs(np.fft.fft2(noise))
            freq_variance = np.var(high_freq)
            
            if noise_std < 2:
                result['score'] = 0.75
                result['indicators'].append('Suspiciously uniform noise')
            elif noise_std < 5:
                result['score'] = 0.4
                result['indicators'].append('Normal noise levels')
            else:
                result['score'] = 0.2
                result['indicators'].append('Natural camera noise detected')
            
            result['noise_std'] = float(noise_std)
            result['frequency_variance'] = float(freq_variance)
            result['verdict'] = 'ai_suspicious' if result['score'] > 0.5 else 'authentic'
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def _compression_analysis(self, img):
        result = {'score': 0.5, 'indicators': [], 'verdict': 'uncertain'}
        
        try:
            buf = io.BytesIO()
            img.save(buf, format='JPEG', quality=95)
            buf.seek(0)
            recompressed = Image.open(buf)
            
            diff = np.array(img, dtype=np.float32) - np.array(recompressed, dtype=np.float32)
            compression_diff = np.mean(np.abs(diff))
            
            if compression_diff < 1:
                result['score'] = 0.6
                result['indicators'].append('Unusual compression behavior')
            else:
                result['score'] = 0.35
                result['indicators'].append('Natural JPEG artifacts')
            
            result['compression_diff'] = float(compression_diff)
            result['verdict'] = 'ai_suspicious' if result['score'] > 0.5 else 'authentic'
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def _color_analysis(self, img):
        result = {'score': 0.5, 'indicators': [], 'verdict': 'uncertain'}
        
        try:
            img_array = np.array(img, dtype=np.float32)
            
            r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
            saturation = np.std([r, g, b], axis=0).mean()
            
            if saturation < 20:
                result['score'] = 0.65
                result['indicators'].append('Low saturation uniformity (possible AI)')
            elif saturation < 40:
                result['score'] = 0.45
                result['indicators'].append('Normal saturation levels')
            else:
                result['score'] = 0.3
                result['indicators'].append('High natural saturation')
            
            result['saturation'] = float(saturation)
            result['verdict'] = 'ai_suspicious' if result['score'] > 0.5 else 'authentic'
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def _texture_analysis(self, img):
        result = {'score': 0.5, 'indicators': [], 'verdict': 'uncertain'}
        
        try:
            gray = img.convert('L')
            edges = gray.filter(ImageFilter.FIND_EDGES)
            edge_array = np.array(edges, dtype=np.float32)
            
            edge_uniformity = np.std(edge_array) / 255.0
            
            if edge_uniformity < 0.05:
                result['score'] = 0.7
                result['indicators'].append('Unusually uniform edges (possible AI)')
            elif edge_uniformity < 0.15:
                result['score'] = 0.4
                result['indicators'].append('Normal edge patterns')
            else:
                result['score'] = 0.25
                result['indicators'].append('Natural edge variation')
            
            result['edge_uniformity'] = float(edge_uniformity)
            result['verdict'] = 'ai_suspicious' if result['score'] > 0.5 else 'authentic'
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def _compute_verdict(self, results):
        weights = {
            'ela_analysis': 0.25,
            'noise_analysis': 0.25,
            'compression_analysis': 0.15,
            'color_analysis': 0.15,
            'texture_analysis': 0.20
        }
        
        weighted_score = 0
        for analysis_name, weight in weights.items():
            if analysis_name in results:
                weighted_score += results[analysis_name]['score'] * weight
        
        ai_probability = weighted_score
        authenticity_score = 1 - ai_probability
        
        is_ai = ai_probability > self.confidence_threshold
        confidence = abs(ai_probability - 0.5) * 2
        
        summary = []
        if is_ai:
            summary.append('Image shows characteristics commonly found in AI-generated content')
        else:
            summary.append('Image shows characteristics consistent with authentic photography')
        
        indicators = []
        for name, res in results.items():
            if res.get('indicators'):
                indicators.extend(res['indicators'])
        
        return {
            'isAI': is_ai,
            'confidence': round(confidence * 100, 1),
            'authenticity_score': round(authenticity_score * 100, 1),
            'ai_probability': round(ai_probability * 100, 1),
            'summary': summary,
            'indicators': indicators[:5]
        }
    
    def _error_result(self, error_message):
        return {
            'success': False,
            'error': error_message,
            'isAI': False,
            'confidence': 0,
            'authenticity_score': 0
        }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No input provided'}))
        sys.exit(1)
    
    try:
        data = json.loads(sys.argv[1])
        image = data.get('image', '')
        
        if not image:
            print(json.dumps({'success': False, 'error': 'No image provided'}))
            sys.exit(1)
        
        detector = SimpleAIDetector()
        result = detector.analyze_image(image)
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        image = sys.argv[1]
        detector = SimpleAIDetector()
        result = detector.analyze_image(image)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
