# ML Module - Image Analysis
# Currently using simple_detector for AI image detection

try:
    from .simple_detector import SimpleAIDetector
    __all__ = ['SimpleAIDetector']
except ImportError:
    __all__ = []
